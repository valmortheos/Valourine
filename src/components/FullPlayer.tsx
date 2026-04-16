import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Repeat, Shuffle, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Track } from '../types';

interface FullPlayerProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

export const FullPlayer: React.FC<FullPlayerProps> = ({
  track,
  isPlaying,
  progress,
  duration,
  volume,
  onTogglePlay,
  onNext,
  onPrev,
  onClose,
  onSeek,
  onVolumeChange,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * duration;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col p-8 bg-inherit overflow-hidden"
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
          <ChevronDown size={28} />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest uppercase opacity-60">Now Playing</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 max-w-md mx-auto w-full">
        <motion.div
          layoutId="album-art"
          className="w-full aspect-square relative group"
        >
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl ring-1 ring-white/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="w-full text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2 truncate"
          >
            {track.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-60"
          >
            Local Track
          </motion.p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative h-2 bg-white/10 rounded-full cursor-pointer group">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: '-8px' }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium opacity-60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <button className="p-2 opacity-40 hover:opacity-100 transition-all">
            <Shuffle size={20} />
          </button>
          <div className="flex items-center gap-8">
            <button onClick={onPrev} className="p-2 hover:scale-110 active:scale-95 transition-all">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button
              onClick={onTogglePlay}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 shadow-xl transition-all"
            >
              {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className="p-2 hover:scale-110 active:scale-95 transition-all">
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>
          <button className="p-2 opacity-40 hover:opacity-100 transition-all">
            <Repeat size={20} />
          </button>
        </div>

        <div className="w-full flex items-center gap-4 px-4 opacity-60 hover:opacity-100 transition-all">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </motion.div>
  );
};
