import React from 'react';
import { Home as HomeIcon, Search, Library as LibraryIcon } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'library', label: 'Library', icon: LibraryIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-2xl border-t border-white/60 px-6 py-3 flex justify-around items-center z-30 sm:relative sm:border-t-0 sm:bg-transparent sm:backdrop-blur-0 sm:flex-col sm:justify-start sm:gap-8 sm:py-10 sm:w-24 sm:px-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-black scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-white shadow-sm ring-1 ring-black/5' : ''}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
