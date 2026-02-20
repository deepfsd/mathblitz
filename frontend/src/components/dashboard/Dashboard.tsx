import React, { useState } from 'react';
import { QuizConfig } from '../../types/quiz';
import { SetupModal } from './SetupModal';

interface Props {
  config: QuizConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
  startQuiz: () => void;
}

export const Dashboard: React.FC<Props> = ({ config, setConfig, startQuiz }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenConfig = (mode: 'multiplication' | 'addition') => {
    setConfig(prev => ({ ...prev, mode }));
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 py-4 lg:px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-8 text-white bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">MathBlitz AI</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block border-r border-slate-200 dark:border-slate-700 pr-4">
            <p className="text-sm font-bold leading-none">Deepanshu</p>
            <p className="text-xs text-primary mt-1 font-semibold">Pro Plan</p>
          </div>
          <div className="size-10 bg-indigo-100 dark:bg-indigo-900/50 text-primary font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-dark shadow-sm">
            D
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">
            Welcome back, <span className="text-primary">Deepanshu!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed">
            You're on a 5-day streak! 🔥 Select your target cognitive drill below.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          <h2 className="text-xl font-bold tracking-tight">Select Drill Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
            <div className="p-6 flex flex-col h-full">
              <div className="size-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">close</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Multiplication Master</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                High-speed drills for tables 2 through 50. Essential for maximizing calculation speed.
              </p>
              <button onClick={() => handleOpenConfig('multiplication')} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition-all">
                Configure Session <span className="material-symbols-outlined text-lg">settings</span>
              </button>
            </div>
          </div>

          <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
            <div className="p-6 flex flex-col h-full">
              <div className="size-14 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">add</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Advanced Addition</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                Multi-digit rapid addition matrices. Train your working memory and mental carry-over skills.
              </p>
              <button onClick={() => handleOpenConfig('addition')} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition-all">
                Configure Session <span className="material-symbols-outlined text-lg">settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <SetupModal config={config} setConfig={setConfig} onClose={() => setIsModalOpen(false)} onStart={() => { setIsModalOpen(false); startQuiz(); }} />
      )}
    </div>
  );
};