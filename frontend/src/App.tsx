import React, { useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { Dashboard } from './components/dashboard/Dashboard';
import { QuizArena } from './components/quiz/QuizArena';

const App: React.FC = () => {
  const { config, setConfig, state, startQuiz, submitAnswer, quitQuiz } = useQuiz();

  useEffect(() => {
    // Adding dark mode class to root for the premium styling
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      {state.status === 'idle' && (
        <Dashboard 
          config={config}
          setConfig={setConfig}
          startQuiz={startQuiz} 
        />
      )}

      {state.status === 'loading' && (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {state.status === 'active' && (
        <QuizArena 
          state={state} 
          config={config} 
          onSubmit={submitAnswer} 
          onQuit={quitQuiz} 
        />
      )}

      {state.status === 'finished' && (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
          <div className="text-center bg-white dark:bg-surface-dark p-10 md:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Session Complete!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              You correctly answered <span className="text-primary font-bold">{state.score}</span> out of {config.totalQuestions} questions.
            </p>
            <button 
              onClick={quitQuiz}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;