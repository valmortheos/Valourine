import React, { useState, useEffect } from 'react';
import { Search, Compass } from 'lucide-react';

export const Explore: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  
  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(() => setGenres(['Pop', 'Country', 'EDM', 'Techno', 'Ambient', 'Jazz']));
  }, []);

  const getGenreColor = (index: number) => {
    const colors = [
      'bg-rose-100 text-rose-600',
      'bg-indigo-100 text-indigo-600',
      'bg-amber-100 text-amber-600',
      'bg-cyan-100 text-cyan-600',
      'bg-emerald-100 text-emerald-600',
      'bg-slate-100 text-slate-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 pb-32 px-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Explore sounds..."
          className="w-full h-12 pl-11 pr-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-sm text-slate-900"
        />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Compass size={20} className="text-slate-900" />
          <h2 className="text-lg font-bold text-slate-900">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {genres.map((genre, i) => (
            <div
              key={genre}
              className={`${getGenreColor(i)} aspect-video rounded-3xl flex items-center justify-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm border border-white/20`}
            >
              <span className="font-bold uppercase tracking-[0.1em] text-[10px] px-2 text-center">{genre}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="py-10 text-center bg-white/20 backdrop-blur-xl rounded-[2rem] border border-white/40">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">End of search</p>
      </div>
    </div>
  );
};
