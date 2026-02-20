import React from 'react';

export const TopNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
        <div className="size-8 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">calculate</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight">MathBlitz AI</h2>
      </div>

      <nav className="hidden md:flex flex-1 justify-center gap-8">
        <a className="text-primary font-bold text-sm border-b-2 border-primary pb-0.5" href="#">Dashboard</a>
        <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">My Progress</a>
        <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Live Battles</a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">diamond</span> Upgrade
          </span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Deepanshu</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pro Plan</p>
          </div>
          <div className="relative cursor-pointer">
            <div className="size-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800">
                <span className="font-bold text-primary">D</span>
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};