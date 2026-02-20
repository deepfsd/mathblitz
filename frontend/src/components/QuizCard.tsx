import React from 'react';
import { QuizState, QuizConfig } from '../types/quiz';

interface Props {
  state: QuizState;
  config: QuizConfig;
  onSubmit: (val: number) => void;
  onQuit: () => void;
}

export const QuizCard: React.FC<Props> = ({ state, config, onSubmit, onQuit }) => {
  const { currentQuestion, timeLeft, questionCount, feedback } = state;

  const operatorSymbol = config.mode === 'addition' ? '+' : '×';

  if (!currentQuestion) return null;

  const progress = (timeLeft / config.timePerQuestion) * 100;
  
  // Disable buttons briefly while transitioning to the next question
  const isTransitioning = feedback !== 'none';
  
  // Dynamic CSS: Card expands slightly on correct, shrinks slightly on wrong
  let cardClass = "relative bg-white border rounded-3xl shadow-xl overflow-hidden transition-all duration-200 ";
  if (feedback === 'correct') {
    cardClass += "border-emerald-400 ring-4 ring-emerald-100 scale-[1.02] ";
  } else if (feedback === 'wrong') {
    cardClass += "border-red-500 ring-4 ring-red-100 scale-[0.98] ";
  } else if (feedback === 'timeout') {
    cardClass += "border-orange-500 ring-4 ring-orange-100 scale-[0.98] ";
  } else {
    cardClass += "border-slate-200 ";
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onQuit} className="text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors flex items-center gap-1">
          <span className="text-lg">←</span> Quit
        </button>
        <div className="text-slate-400 text-sm font-medium tracking-wide">
          QUESTION {questionCount + 1} <span className="text-slate-200">/</span> {config.totalQuestions}
        </div>
      </div>

      <div className={cardClass}>
        <div className="h-1.5 w-full bg-slate-100">
          <div className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 pb-10">
          <div className="flex flex-wrap justify-center items-end gap-3 mb-12 mt-4">
            {currentQuestion.numbers.map((num, idx) => (
              <React.Fragment key={idx}>
                <div className="text-6xl font-bold text-slate-800 tracking-tighter">{num}</div>
                {idx < currentQuestion.numbers.length - 1 && (
                  <div className="text-4xl font-medium text-slate-300 mb-2">{operatorSymbol}</div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onSubmit(option)}
                disabled={isTransitioning} 
                className={`w-full py-6 text-2xl font-bold rounded-xl border-2 transition-all duration-200
                  ${isTransitioning 
                    ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-default' 
                    : 'border-slate-100 bg-white text-slate-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md active:scale-[0.98]'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center h-8">
        {state.streak > 1 && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-100 animate-fade-in-up">🔥 {state.streak} Streak</span>
        )}
      </div>
    </div>
  );
};