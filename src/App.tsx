/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { TrackList } from './components/TrackList';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { Track } from './types';
import { useColorExtractor } from './hooks/useColorExtractor';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const colors = useColorExtractor(currentTrack?.thumbnail);

  useEffect(() => {
    const fetchWithCheck = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but received ${contentType || 'unknown content'}`);
      }
      
      return res.json();
    };

    const loadTracks = async () => {
      try {
        // 1. Try internal API (Dev/Local)
        const data = await fetchWithCheck('/api/tracks');
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
          return;
        }
        throw new Error('API returned empty tracks');
      } catch (apiErr) {
        console.warn('API fetch failed, trying static fallback:', apiErr);
        
        try {
          // 2. Try static tracks.json (GitHub Pages fallback)
          const staticData = await fetchWithCheck('./tracks.json');
          setTracks(Array.isArray(staticData) ? staticData : []);
        } catch (staticErr) {
          console.error('All fetch attempts failed:', staticErr);
          setTracks([]);
        }
      }
    };

    loadTracks();

    // Request notification permission
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
        { src: currentTrack.thumbnail, sizes: '128x128', type: 'image/jpeg' },
        { src: currentTrack.thumbnail, sizes: '192x192', type: 'image/jpeg' },
        { src: currentTrack.thumbnail, sizes: '256x256', type: 'image/jpeg' },
        { src: currentTrack.thumbnail, sizes: '384x384', type: 'image/jpeg' },
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

  const handleTrackSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
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
    setProgress((current / total) * 100);
    setDuration(total);
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

  return (
    <div 
      className="min-h-screen transition-colors duration-700 ease-in-out overflow-x-hidden"
      style={{ 
        backgroundColor: colors.primary,
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.9))` 
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        className="hidden"
      />

      <header className="p-8 pt-16">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">Valourine</h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Personal Soundscape</p>
      </header>

      <main className="max-w-2xl mx-auto">
        <TrackList
          tracks={tracks}
          currentTrackId={currentTrack?.id}
          onTrackSelect={handleTrackSelect}
        />
      </main>

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
