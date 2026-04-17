import React from 'react';
import { Track } from '../../types';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface HomeProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
}

export const Home: React.FC<HomeProps> = ({ tracks, onTrackSelect }) => {
  const recentTracks = tracks.slice(0, 4);

  return (
    <div className="space-y-10 pb-32">
      <section>
        <h2 className="text-xl font-black text-slate-900 mb-6 px-2">Featured Hits</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTrackSelect(track)}
                className="flex-shrink-0 w-48 group cursor-pointer"
              >
                <div className="relative aspect-square mb-3">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover rounded-[2rem] shadow-lg group-hover:shadow-xl transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-lg">
                      <Play className="fill-black text-black" size={24} />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 truncate px-1">{track.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Original</p>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-20 text-center bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No featured tracks yet</p>
            </div>
          )}
        </div>
      </section>

      <section className="px-2">
        <h2 className="text-xl font-black text-slate-900 mb-6">Quick Picks</h2>
        <div className="grid grid-cols-2 gap-4">
          {recentTracks.map((track) => (
            <div 
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className="flex items-center gap-3 p-2 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 cursor-pointer hover:bg-white/50 transition-all"
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-12 h-12 object-cover rounded-xl shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{track.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
