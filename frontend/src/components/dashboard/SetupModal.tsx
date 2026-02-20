import React from 'react';
import { QuizConfig } from '../../types/quiz';
import { WheelPicker } from '../common/WheelPicker';

interface Props {
  config: QuizConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
  onClose: () => void;
  onStart: () => void;
}

export const SetupModal: React.FC<Props> = ({ config, setConfig, onClose, onStart }) => {
  const updateConfig = (key: keyof QuizConfig, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">Configure {config.mode}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Main Numbers Setup */}
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {config.mode === 'multiplication' ? (
              <>
                <WheelPicker label="Start Table" value={config.startTable} min={1} max={20} onChange={(v) => updateConfig('startTable', v)} />
                <span className="text-slate-300 dark:text-slate-600 font-black text-xl italic pb-6">to</span>
                <WheelPicker label="End Table" value={config.endTable} min={1} max={50} onChange={(v) => updateConfig('endTable', v)} />
              </>
            ) : (
              <>
                <WheelPicker label="Digits" value={config.addDigits} min={1} max={5} onChange={(v) => updateConfig('addDigits', v)} />
                <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 pb-6">add_circle</span>
                <WheelPicker label="Total Numbers" value={config.addTermCount} min={2} max={5} onChange={(v) => updateConfig('addTermCount', v)} />
              </>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Time Limit & Question Count */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time per Question</label>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                  {config.timePerQuestion}s
                </span>
              </div>
              <input
                type="range"
                min="3" max="30"
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                value={config.timePerQuestion}
                onChange={(e) => updateConfig('timePerQuestion', Number(e.target.value))}
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                <span>⚡ Fast (3s)</span>
                <span>🐢 Relaxed (30s)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Session Length</label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 20, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateConfig('totalQuestions', num)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      config.totalQuestions === num
                        ? 'bg-primary border-primary text-white'
                        : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-surface-darker">
          <button onClick={onStart} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
            Start Session 🚀
          </button>
        </div>
      </div>
    </div>
  );
};