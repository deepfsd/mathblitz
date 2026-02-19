import React, { useState, useEffect } from 'react';
import { QuizConfig, PerformanceLog } from '../types/quiz';
import { quizApi } from '../api/quizApi';

import { MultiplicationForm } from './setup/MultiplicationForm';
import { AdditionForm } from './setup/AdditionForm';
import { SetupControls } from './setup/SetupControls';
import { ComingSoonCard } from './setup/ComingSoonCard';
import { PerformanceSidebar } from './stats/PerformanceSidebar';

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

  const updateConfig = (key: keyof QuizConfig, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in items-start">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Quiz</h1>
              <p className="text-slate-500 font-medium">Configure your training parameters.</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => updateConfig('mode', 'multiplication')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${config.mode === 'multiplication' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                × Multiply
              </button>
              <button
                onClick={() => updateConfig('mode', 'addition')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${config.mode === 'addition' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                + Add
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {config.mode === 'multiplication' ? (
              <MultiplicationForm 
                startTable={config.startTable} 
                endTable={config.endTable} 
                onChange={updateConfig} 
              />
            ) : (
              <AdditionForm 
                digits={config.addDigits} 
                termCount={config.addTermCount} 
                onChange={updateConfig} 
              />
            )}

            <SetupControls 
              timePerQuestion={config.timePerQuestion}
              totalQuestions={config.totalQuestions}
              onChange={updateConfig}
            />

            <button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xl py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0 mt-8"
            >
              Start Session 🚀
            </button>
          </div>
        </div>

        <ComingSoonCard />

      </div>

      <div className="lg:col-span-5">
        <PerformanceSidebar 
          history={history} 
          onClear={() => { quizApi.clearHistory(); setHistory([]); }} 
        />
      </div>
    </div>
  );
};