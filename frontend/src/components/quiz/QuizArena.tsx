import React from 'react';
import { QuizState, QuizConfig } from '../../types/quiz';

interface Props {
  state: QuizState;
  config: QuizConfig;
  onSubmit: (val: number) => void;
  onQuit: () => void;
}

export const QuizArena: React.FC<Props> = ({ state, config, onSubmit, onQuit }) => {
  const { currentQuestion, timeLeft, questionCount, feedback, streak } = state;

  if (!currentQuestion) return null;

  const operatorSymbol = config.mode === 'addition' ? '+' : '×';
  const progressPercent = ((questionCount) / config.totalQuestions) * 100;

  let cardBorder = "border-slate-200 dark:border-slate-700";
  if (feedback === 'correct') cardBorder = "border-green-500 ring-2 ring-green-500/50 scale-[1.01]";
  if (feedback === 'wrong') cardBorder = "border-red-500 ring-2 ring-red-500/50 scale-[0.99]";
  if (feedback === 'timeout') cardBorder = "border-orange-500 ring-2 ring-orange-500/50";

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col overflow-hidden text-[#0d141b] dark:text-white font-display">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-4 md:px-6 py-3 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>Live Session</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
            <span className="text-primary font-bold capitalize">{config.mode} Drill</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-500 text-lg md:text-xl">timer</span>
            <span className={`font-bold font-mono text-base md:text-lg ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <button onClick={onQuit} className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Exit
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-1">Question Palette</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: config.totalQuestions }).map((_, i) => (
                <div key={i} className={`size-10 flex items-center justify-center rounded-lg font-bold text-sm border transition-all
                  ${i < questionCount ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 
                    i === questionCount ? 'bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 dark:ring-offset-surface-dark' : 
                    'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
               <span>Completion</span>
               <span>{Math.round(progressPercent)}%</span>
             </div>
             <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative flex flex-col justify-center items-center px-4 md:px-8 py-8 pb-24">
          <div className={`w-full max-w-2xl bg-white dark:bg-surface-dark rounded-2xl shadow-sm border ${cardBorder} transition-all duration-200 overflow-hidden`}>
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-surface-darker/50 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                Question {questionCount + 1} of {config.totalQuestions}
              </span>
              {streak > 2 && (
                 <span className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                   <span className="material-symbols-outlined text-sm">local_fire_department</span> {streak} Streak
                 </span>
              )}
            </div>
            
            <div className="p-6 md:p-14 flex flex-col items-center">
              <div className="flex flex-wrap justify-center items-end gap-3 md:gap-4 mb-10 md:mb-14">
                {currentQuestion.numbers.map((num, idx) => (
                  <React.Fragment key={idx}>
                    <div className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">{num}</div>
                    {idx < currentQuestion.numbers.length - 1 && (
                      <div className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-300 dark:text-slate-600 mb-1 md:mb-2">{operatorSymbol}</div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onSubmit(option)}
                    disabled={feedback !== 'none'}
                    className={`group relative flex items-center justify-center p-4 md:p-5 rounded-xl border-2 transition-all duration-150 active:scale-[0.98]
                      ${feedback !== 'none' ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50' : 
                      'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary'}`}
                  >
                    <span className="text-2xl font-bold">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};