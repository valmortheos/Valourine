import React from 'react';
import { Search, Compass } from 'lucide-react';

export const Explore: React.FC = () => {
  const genres = [
    { name: 'Pop', color: 'bg-rose-100 text-rose-600' },
    { name: 'Lo-Fi', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Jazz', color: 'bg-amber-100 text-amber-600' },
    { name: 'Electronic', color: 'bg-cyan-100 text-cyan-600' },
    { name: 'Ambient', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Classic', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-10 pb-32 px-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search for pure sounds..."
          className="w-full h-14 pl-12 pr-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-slate-900"
        />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Compass size={24} className="text-slate-900" />
          <h2 className="text-xl font-black text-slate-900">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className={`${genre.color} aspect-video rounded-[2rem] flex items-center justify-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm border border-white/20`}
            >
              <span className="font-black uppercase tracking-[0.2em] text-xs px-2 text-center">{genre.name}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="py-12 text-center bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">End of search</p>
      </div>
    </div>
  );
};
