import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import { SetupScreen } from './components/SetupScreen';
import { QuizCard } from './components/QuizCard';

const App: React.FC = () => {
  const { config, setConfig, state, startQuiz, submitAnswer, quitQuiz } = useQuiz();

  return (
    // Clean Slate Background
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-700">
      
      <div className="w-full">
        {state.status === 'idle' && (
          <SetupScreen config={config} setConfig={setConfig} onStart={startQuiz} />
        )}

        {state.status === 'loading' && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-100 border-t-indigo-600"></div>
            <p className="mt-4 text-slate-400 font-medium text-sm tracking-wide">PREPARING SESSION...</p>
          </div>
        )}

        {state.status === 'active' && (
          <QuizCard 
            state={state} 
            config={config} 
            onSubmit={submitAnswer}
            onQuit={quitQuiz} 
          />
        )}

        {state.status === 'finished' && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 p-10 rounded-3xl shadow-xl text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              📊
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Complete</h2>
            <p className="text-slate-500 mb-8">Here is how you performed today.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Score</div>
                <div className="text-3xl font-bold text-indigo-600 mt-1">{state.score}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Accuracy</div>
                <div className="text-3xl font-bold text-slate-700 mt-1">
                  {Math.round((state.score / config.totalQuestions) * 100)}%
                </div>
              </div>
            </div>

            <button
              onClick={quitQuiz}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;