import React from 'react';
import { Play, Music } from 'lucide-react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string;
  onTrackSelect: (track: Track) => void;
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, currentTrackId, onTrackSelect }) => {
  return (
    <div className="flex flex-col gap-4 pb-32">
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Music size={48} className="mb-4 opacity-20" />
          <p>No music found in folder</p>
        </div>
      ) : (
        tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(track)}
            className={`flex items-center gap-3 p-3 rounded-[1.5rem] transition-all active:scale-95 border border-white/40 backdrop-blur-md ${
              currentTrackId === track.id
                ? 'bg-white/60 shadow-lg'
                : 'bg-white/20 hover:bg-white/30 shadow-sm'
            }`}
          >
            <div className="relative w-11 h-11 flex-shrink-0">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover rounded-[1rem] shadow-sm"
                referrerPolicy="no-referrer"
              />
              {currentTrackId === track.id && (
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-white animate-bounce h-full" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 bg-white animate-bounce h-2/3" style={{ animationDelay: '100ms' }} />
                    <div className="w-1 bg-white animate-bounce h-full" style={{ animationDelay: '200ms' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className={`font-semibold text-sm truncate pr-2 ${currentTrackId === track.id ? 'text-black' : 'text-slate-800'}`}>
                {track.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold truncate uppercase tracking-wider">
                {track.genre || 'Local Track'}
              </p>
            </div>
            <div className={`p-2 rounded-full ${currentTrackId === track.id ? 'bg-black text-white' : 'bg-black/5 text-slate-400'}`}>
              <Play size={14} className={currentTrackId === track.id ? 'fill-current' : ''} />
            </div>
          </button>
        ))
      )}
    </div>
  );
};
