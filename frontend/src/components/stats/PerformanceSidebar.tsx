import React from 'react';
import { PerformanceLog } from '../../types/quiz';

interface Props {
  history: PerformanceLog[];
  onClear: () => void;
}

export const PerformanceSidebar: React.FC<Props> = ({ history, onClear }) => {
  const mistakes = history.filter(h => h.result === 'wrong' || h.result === 'timeout').reverse();
  const slowWins = history.filter(h => h.result === 'correct').sort((a, b) => b.timeTaken - a.timeTaken).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Mistakes Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="text-red-500">●</span> Focus Areas
          </h3>
          {mistakes.length > 0 && (
            <button onClick={onClear} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors bg-slate-50 px-2 py-1 rounded border border-slate-100">
              CLEAR
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar min-h-[150px]">
          {mistakes.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
              <div className="text-3xl mb-2 opacity-80">🎯</div>
              <p className="text-sm font-bold text-slate-600">No active mistakes</p>
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
  );
};