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
    fetch('/api/tracks')
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error('Failed to fetch tracks', err));

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (track: Track) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Valourine', {
        body: `Now Playing: ${track.title}`,
        icon: track.thumbnail,
        silent: true,
      });
    }
  };

  const handleTrackSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    showNotification(track);
    
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
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))` 
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        className="hidden"
      />

      <header className="p-6 pt-12">
        <h1 className="text-4xl font-black tracking-tighter">Valourine</h1>
        <p className="text-white/50 text-sm font-medium">Your Personal Soundscape</p>
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
