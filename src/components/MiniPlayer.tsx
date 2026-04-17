import React from 'react';
import { Play, Pause, SkipForward, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

interface MiniPlayerProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying,
  progress,
  onTogglePlay,
  onNext,
  onExpand,
}) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-24 left-4 right-4 sm:bottom-6 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-2 shadow-2xl z-40 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div 
          className="relative w-11 h-11 flex-shrink-0 cursor-pointer"
          onClick={onExpand}
        >
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover rounded-[1rem] shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Maximize2 size={16} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0" onClick={onExpand}>
          <h4 className="font-bold text-slate-900 text-sm truncate">{track.title}</h4>
          <p className="text-xs text-slate-500 font-medium truncate">Now Playing</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-full bg-black text-white hover:scale-105 active:scale-95 shadow-md transition-all"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            onClick={onNext}
            className="p-2.5 rounded-full hover:bg-black/5 transition-all text-slate-400"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-6 right-6 h-1 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};
