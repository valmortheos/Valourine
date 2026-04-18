/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { Navigation } from './components/Navigation';
import { Home } from './components/pages/Home';
import { Explore } from './components/pages/Explore';
import { Library } from './components/pages/Library';
import { Track } from './types';
import { useColorExtractor } from './hooks/useColorExtractor';
import { initDB, getCachedAudio, cacheAudio } from './services/dbService';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const colors = useColorExtractor(currentTrack?.thumbnail);

  useEffect(() => {
    initDB();

    const loadTracks = async () => {
      try {
        // First attempt: Call the Express API (works in AI Studio/Full-stack)
        const res = await fetch('/api/tracks');
        
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            setTracks(Array.isArray(data) ? data : []);
            return;
          }
        }

        // Fallback: If 404 or not JSON (e.g., Static Hosting like GitHub Pages)
        // We attempt to fetch the static metadata file instead
        console.log('API not found or invalid, trying static fallback...');
        const staticRes = await fetch('/music-metadata.json');
        if (staticRes.ok) {
          const data = await staticRes.json();
          // Transform metadata to Track format
          const formattedTracks = (data.tracks || []).map((t: any) => {
            const nameOnly = t.filename.split('.').slice(0, -1).join('.') || t.filename;
            return {
              id: nameOnly,
              title: t.title || nameOnly,
              genre: t.genre || 'Unknown',
              url: `/music/${t.filename}`,
              thumbnail: t.thumbnail ? `/musict/${t.thumbnail}` : `https://picsum.photos/seed/${encodeURIComponent(t.filename)}/400/400`
            };
          });
          setTracks(formattedTracks);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error('Failed to load tracks:', err);
        setTracks([]);
      }
    };

    loadTracks();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!currentTrack || !audioRef.current || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: 'Valourine Player',
      album: 'Internal Music',
      artwork: [
        { src: currentTrack.thumbnail, sizes: '96x96', type: 'image/jpeg' },
        { src: currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audioRef.current?.play();
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
    navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [currentTrack]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const handleTrackSelect = async (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      // IndexedDB Caching Logic
      try {
        const cachedBlob = await getCachedAudio(track.id);
        if (cachedBlob) {
          console.log('Playing from cache:', track.title);
          const blobUrl = URL.createObjectURL(cachedBlob);
          audioRef.current.src = blobUrl;
        } else {
          console.log('Playing from network and caching:', track.title);
          audioRef.current.src = track.url;
          
          // Fetch and cache for next time
          fetch(track.url)
            .then(res => res.blob())
            .then(blob => cacheAudio(track.id, blob))
            .catch(e => console.error('Caching failed', e));
        }
        audioRef.current.play();
      } catch (e) {
        console.error('Playback/Cache error', e);
        audioRef.current.src = track.url;
        audioRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleTrackSelect(tracks[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleTrackSelect(tracks[prevIndex]);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    if (!isNaN(total)) {
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home tracks={tracks} onTrackSelect={handleTrackSelect} />;
      case 'explore':
        return <Explore />;
      case 'library':
        return <Library tracks={tracks} currentTrackId={currentTrack?.id} onTrackSelect={handleTrackSelect} />;
      default:
        return <Home tracks={tracks} onTrackSelect={handleTrackSelect} />;
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 ease-in-out flex flex-col sm:flex-row-reverse"
      style={{ 
        backgroundColor: colors.primary,
        backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` 
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        className="hidden"
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-screen">
        <header className="px-6 pt-10 pb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Valourine</h1>
          </div>
          <div className="p-2.5 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm hidden sm:block">
            <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider px-2">{activeTab}</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence>
        {currentTrack && !isFullPlayer && (
          <MiniPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            onTogglePlay={togglePlay}
            onNext={handleNext}
            onExpand={() => setIsFullPlayer(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullPlayer && currentTrack && (
          <FullPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            volume={volume}
            onTogglePlay={togglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            onClose={() => setIsFullPlayer(false)}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
