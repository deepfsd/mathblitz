import React from 'react';

interface Props {
  timePerQuestion: number;
  totalQuestions: number;
  onChange: (key: 'timePerQuestion' | 'totalQuestions', val: number) => void;
}

export const SetupControls: React.FC<Props> = ({ timePerQuestion, totalQuestions, onChange }) => {
  return (
    <div className="space-y-8 pt-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time per Question</label>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
            {timePerQuestion}s
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="30"
          className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
          value={timePerQuestion}
          onChange={(e) => onChange('timePerQuestion', Number(e.target.value))}
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 uppercase">
          <span>⚡ Fast (3s)</span>
          <span>🐢 Relaxed (30s)</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Session Length</label>
        <div className="grid grid-cols-4 gap-3">
          {[10, 20, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => onChange('totalQuestions', num)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                totalQuestions === num
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};