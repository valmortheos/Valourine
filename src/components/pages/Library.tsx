import React from 'react';
import { Track } from '../../types';
import { TrackList } from '../TrackList';
import { Library as LibraryIcon, Trash2 } from 'lucide-react';
import { clearCache } from '../../services/dbService';

interface LibraryProps {
  tracks: Track[];
  currentTrackId?: string;
  onTrackSelect: (track: Track) => void;
}

export const Library: React.FC<LibraryProps> = ({ tracks, currentTrackId, onTrackSelect }) => {
  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear the local music cache? You will need to re-download tracks.')) {
      await clearCache();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm">
            <LibraryIcon size={24} className="text-slate-900" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Library</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tracks.length} Tracks Offline</p>
          </div>
        </div>
        <button 
          onClick={handleClearCache}
          className="p-3 text-slate-400 hover:text-rose-500 transition-colors"
          title="Clear Cache"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <TrackList
        tracks={tracks}
        currentTrackId={currentTrackId}
        onTrackSelect={onTrackSelect}
      />
    </div>
  );
};
