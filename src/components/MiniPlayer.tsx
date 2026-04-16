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
      className="fixed bottom-6 left-4 right-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl z-40"
    >
      <div className="flex items-center gap-3">
        <div 
          className="relative w-12 h-12 flex-shrink-0 cursor-pointer"
          onClick={onExpand}
        >
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover rounded-xl shadow-lg"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Maximize2 size={16} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0" onClick={onExpand}>
          <h4 className="font-semibold text-sm truncate">{track.title}</h4>
          <p className="text-xs text-gray-400 truncate">Now Playing</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePlay}
            className="p-3 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            onClick={onNext}
            className="p-3 rounded-full hover:bg-white/10 transition-all"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};
