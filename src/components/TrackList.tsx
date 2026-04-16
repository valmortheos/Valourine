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
    <div className="flex flex-col gap-4 p-4 pb-32">
      <h2 className="text-2xl font-bold mb-2">Your Library</h2>
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
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-95 ${
              currentTrackId === track.id
                ? 'bg-white/10 shadow-lg'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="relative w-14 h-14 flex-shrink-0">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover rounded-xl shadow-md"
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
            <div className="flex-1 text-left">
              <h3 className={`font-medium truncate ${currentTrackId === track.id ? 'text-white' : 'text-gray-200'}`}>
                {track.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">Local Track</p>
            </div>
            <div className="p-2 rounded-full bg-white/5">
              <Play size={16} className={currentTrackId === track.id ? 'fill-white text-white' : 'text-gray-400'} />
            </div>
          </button>
        ))
      )}
    </div>
  );
};
