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
      className="fixed inset-0 z-50 flex flex-col p-8 bg-white/40 backdrop-blur-3xl overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="p-2 rounded-full bg-black/5 text-slate-900 hover:bg-black/10 transition-all">
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/40">Now Playing</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-sm mx-auto w-full">
        <motion.div
          layoutId="album-art"
          className="w-full aspect-square relative"
        >
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] ring-1 ring-white/40"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="w-full text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-slate-900 mb-0.5 truncate"
          >
            {track.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base font-bold text-slate-400"
          >
            Local Track
          </motion.p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative h-2 bg-black/5 rounded-full cursor-pointer group">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-black border-4 border-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: '-10px' }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <button className="p-2 text-slate-400 hover:text-black transition-all">
            <Shuffle size={24} />
          </button>
          <div className="flex items-center gap-6">
            <button onClick={onPrev} className="p-2 text-slate-900 hover:scale-110 active:scale-90 transition-all">
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button
              onClick={onTogglePlay}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-white hover:scale-105 active:scale-95 shadow-lg transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className="p-2 text-slate-900 hover:scale-110 active:scale-90 transition-all">
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-black transition-all">
            <Repeat size={24} />
          </button>
        </div>

        <div className="w-full flex items-center gap-4 px-4">
          <Volume2 size={20} className="text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer accent-black"
          />
        </div>
      </div>
    </motion.div>
  );
};
