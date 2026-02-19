import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizConfig, QuizState } from '../types/quiz';
import { quizApi } from '../api/quizApi';

const DEFAULT_CONFIG: QuizConfig = {
  mode: 'multiplication',
  startTable: 2,
  endTable: 12,
  addDigits: 2,
  addTermCount: 2,
  timePerQuestion: 10,
  totalQuestions: 10,
};

const INITIAL_STATE: QuizState = {
  status: 'idle',
  currentQuestion: null,
  score: 0,
  streak: 0,
  timeLeft: 10,
  questionCount: 0,
  feedback: 'none',
};

export const useQuiz = () => {
  const [config, setConfig] = useState<QuizConfig>(DEFAULT_CONFIG);
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  
  const isFetchingRef = useRef(false);

  const nextQuestion = useCallback(async () => {
    isFetchingRef.current = true;
    try {
      const question = await quizApi.getQuestion(config);
      setState(prev => {
        if (prev.status === 'idle') return prev;
        
        return {
          ...prev,
          status: 'active',
          currentQuestion: question,
          timeLeft: config.timePerQuestion,
          feedback: 'none'
        };
      });
    } catch (error) {
      console.error("Failed to load question", error);
      setState(prev => (prev.status !== 'idle' ? { ...prev, status: 'idle' } : prev));
    } finally {
      isFetchingRef.current = false;
    }
  }, [config]);

  const startQuiz = useCallback(async () => {
    if (isFetchingRef.current) return; 
    setState({ ...INITIAL_STATE, status: 'loading' });
    await nextQuestion();
  }, [nextQuestion]);

  const quitQuiz = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const submitAnswer = async (answer: number) => {
    if (state.status !== 'active' || !state.currentQuestion) return;

    const { numbers } = state.currentQuestion;
    const timeTaken = Number((config.timePerQuestion - state.timeLeft).toFixed(2));

    try {
      const result = await quizApi.checkAnswer(numbers, answer, config.mode);
      const isCorrect = result.correct;
      const operator = config.mode === 'addition' ? '+' : '×';
      
      const questionString = numbers.join(` ${operator} `);

      quizApi.saveHistory({
        id: Date.now().toString(),
        question: questionString,
        result: isCorrect ? 'correct' : 'wrong',
        timeTaken: timeTaken,
        date: new Date().toLocaleDateString('en-GB')
      });

      setState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        streak: isCorrect ? prev.streak + 1 : 0,
        feedback: isCorrect ? 'correct' : 'wrong'
      }));

      setTimeout(() => {
        setState(prev => {
          if (prev.status === 'idle') return prev; 

          if (prev.questionCount + 1 >= config.totalQuestions) {
            return { ...prev, status: 'finished', feedback: 'none' } as QuizState;
          } else {
            nextQuestion(); 
            return { ...prev, questionCount: prev.questionCount + 1 };
          }
        });
      }, 1000);

    } catch (error) {
      console.error("Failed to check answer:", error);
    }
  };

  // --- 1. THE TIMER: Only handles counting down ---
  useEffect(() => {
    if (state.status !== 'active' || state.feedback !== 'none') return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'active' || prev.feedback !== 'none') {
          clearInterval(timer);
          return prev;
        }

        // When time hits 0, just change the state. Don't save history here!
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, feedback: 'timeout', streak: 0 };
        }
        
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, state.feedback]);


  // --- 2. TIMEOUT HANDLER: Triggers once when the state becomes 'timeout' ---
  useEffect(() => {
    if (state.status === 'active' && state.feedback === 'timeout' && state.currentQuestion) {
      const operator = config.mode === 'addition' ? '+' : '×';
      
      // Save history safely outside of the setState callback
      quizApi.saveHistory({
        id: Date.now().toString(),
        question: state.currentQuestion.numbers.join(` ${operator} `),
        result: 'timeout',
        timeTaken: config.timePerQuestion,
        date: new Date().toLocaleDateString('en-GB')
      });

      // Move to next question after a brief delay so user sees "Time's Up"
      const t = setTimeout(() => {
        setState(p => {
          if (p.status === 'idle') return p; 
          
          if (p.questionCount + 1 >= config.totalQuestions) {
             return { ...p, status: 'finished', feedback: 'none' } as QuizState;
          } else {
             nextQuestion();
             return { ...p, questionCount: p.questionCount + 1 };
          }
        });
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [state.status, state.feedback, state.currentQuestion, config, nextQuestion]);

  return { config, setConfig, state, startQuiz, submitAnswer, quitQuiz };
};