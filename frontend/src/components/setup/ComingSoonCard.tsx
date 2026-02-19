import React from 'react';

export const ComingSoonCard: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group border border-slate-800">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-600 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm mb-1 flex items-center gap-2 text-yellow-400 uppercase tracking-wider">
            <span>★</span> Coming Soon
          </h3>
          <p className="text-slate-400 text-xs font-medium">New features arriving in v1.1</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-slate-300 border border-white/10">
          Roadmap
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">⚔️</div>
          <div>
            <div className="font-bold text-sm text-slate-100">PvP Battles</div>
            <div className="text-[10px] text-slate-400 font-medium">Multiplayer Mode</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">📈</div>
          <div>
            <div className="font-bold text-sm text-slate-100">Analytics</div>
            <div className="text-[10px] text-slate-400 font-medium">Weekly Progress</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg">➖</div>
          <div>
            <div className="font-bold text-sm text-slate-100">Subtraction</div>
            <div className="text-[10px] text-slate-400 font-medium">Advanced Drill</div>
          </div>
        </div>
      </div>
    </div>
  );
};