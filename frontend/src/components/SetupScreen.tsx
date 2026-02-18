import React, { useState, useEffect } from 'react';
import { QuizConfig, PerformanceLog } from '../types/quiz';
import { quizApi } from '../api/quizApi';

interface Props {
  config: QuizConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
  onStart: () => void;
}

export const SetupScreen: React.FC<Props> = ({ config, setConfig, onStart }) => {
  const [history, setHistory] = useState<PerformanceLog[]>([]);

  useEffect(() => {
    setHistory(quizApi.getHistory());
  }, []);

  const mistakes = history
    .filter(h => h.result === 'wrong' || h.result === 'timeout')
    .reverse();

  const slowWins = history
    .filter(h => h.result === 'correct')
    .sort((a, b) => b.timeTaken - a.timeTaken)
    .slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in items-start">
      
      {/* LEFT COLUMN: Setup + Coming Soon */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Main Configuration Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Quiz</h1>
            <p className="text-slate-500 font-medium">Configure your training parameters.</p>
          </div>

          <div className="space-y-8">
            
            {/* 1. Table Range (Redesigned Inputs) */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Multiplication Tables</label>
              <div className="flex items-center gap-4">
                {/* Start Input */}
                <div className="flex-1">
                  <div className="relative group">
                    <input
                      type="number"
                      className="w-full text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      value={config.startTable}
                      onChange={(e) => setConfig({ ...config, startTable: Number(e.target.value) })}
                    />
                    <div className="absolute inset-x-0 -bottom-6 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">Start</span>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-black text-xl pt-2">to</span>

                {/* End Input */}
                <div className="flex-1">
                  <div className="relative group">
                    <input
                      type="number"
                      className="w-full text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      value={config.endTable}
                      onChange={(e) => setConfig({ ...config, endTable: Number(e.target.value) })}
                    />
                    <div className="absolute inset-x-0 -bottom-6 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">End</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Time Limit */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time per Question</label>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
                  {config.timePerQuestion}s
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
                value={config.timePerQuestion}
                onChange={(e) => setConfig({ ...config, timePerQuestion: Number(e.target.value) })}
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 uppercase">
                 <span>⚡ Fast (3s)</span>
                 <span>🐢 Relaxed (30s)</span>
              </div>
            </div>

            {/* 3. Questions Count */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Session Length</label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 20, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setConfig({ ...config, totalQuestions: num })}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      config.totalQuestions === num
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xl py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0"
            >
              Start Session 🚀
            </button>
          </div>
        </div>

        {/* COMING SOON SECTION (Now under Start Button) */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group border border-slate-800">
            {/* Background Effects */}
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
            
            <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
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
            </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Stats */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Mistakes Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-red-500">●</span> Focus Areas
            </h3>
            {mistakes.length > 0 && (
              <button onClick={() => { quizApi.clearHistory(); setHistory([]); }} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors bg-slate-50 px-2 py-1 rounded border border-slate-100">
                CLEAR
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar min-h-[150px]">
            {mistakes.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                <div className="text-3xl mb-2 opacity-80">🎯</div>
                <p className="text-sm font-bold text-slate-600">No active mistakes</p>
                <p className="text-xs text-slate-400 mt-1">Ready to start training!</p>
              </div>
            ) : (
              mistakes.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100 hover:border-red-200 transition-all group">
                  <span className="font-black text-slate-700 text-lg group-hover:text-red-600 transition-colors">{entry.question}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white text-red-500 uppercase tracking-wider border border-red-100 shadow-sm">
                    {entry.result === 'timeout' ? 'TIMEOUT' : 'FAILED'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slow Wins Card */}
        {slowWins.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 animate-fade-in-up">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-orange-400">●</span> Slowest Correct
            </h3>
            <div className="space-y-2">
              {slowWins.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <span className="font-medium text-slate-600">{entry.question}</span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{entry.timeTaken}s</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};