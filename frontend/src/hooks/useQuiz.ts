import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizConfig, QuizState } from '../types/quiz';
import { quizApi } from '../api/quizApi';

// 1. Direct audio imports (Make sure files are in src/assets/)
import correctSound from '../assets/correct.mp3';
import incorrectSound from '../assets/incorrect.mp3';

// 2. Brute-force audio player for rapid-fire clicking
const playSound = (type: 'correct' | 'wrong' | 'timeout') => {
  try {
    const audio = new Audio(type === 'correct' ? correctSound : incorrectSound);
    audio.play().catch((error) => {
      console.warn("Browser blocked audio. User must click first.", error);
    });
  } catch (error) {
    console.error("Audio system error:", error);
  }
};

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

// THIS IS THE MISSING EXPORT!
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
        return { ...prev, status: 'active', currentQuestion: question, timeLeft: config.timePerQuestion, feedback: 'none' };
      });
    } catch (error) {
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

  const quitQuiz = useCallback(() => setState(INITIAL_STATE), []);

  const submitAnswer = async (answer: number) => {
    if (state.status !== 'active' || !state.currentQuestion) return;
    const { numbers } = state.currentQuestion;
    const timeTaken = Number((config.timePerQuestion - state.timeLeft).toFixed(2));

    try {
      const { correct } = await quizApi.checkAnswer(numbers, answer, config.mode);
      
      // FIRE AUDIO
      playSound(correct ? 'correct' : 'wrong');

      quizApi.saveHistory({
        id: Date.now().toString(),
        question: numbers.join(config.mode === 'addition' ? ' + ' : ' × '),
        result: correct ? 'correct' : 'wrong',
        timeTaken,
        date: new Date().toLocaleDateString('en-GB')
      });

      setState(prev => ({
        ...prev,
        score: correct ? prev.score + 1 : prev.score,
        streak: correct ? prev.streak + 1 : 0,
        feedback: correct ? 'correct' : 'wrong'
      }));

      setTimeout(() => {
        setState(prev => {
          if (prev.status === 'idle') return prev; 
          if (prev.questionCount + 1 >= config.totalQuestions) {
            return { ...prev, status: 'finished', feedback: 'none' };
          }
          nextQuestion(); 
          return { ...prev, questionCount: prev.questionCount + 1 };
        });
      }, 300);
    } catch (error) {}
  };

  useEffect(() => {
    if (state.status !== 'active' || state.feedback !== 'none') return;
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'active' || prev.feedback !== 'none') {
          clearInterval(timer);
          return prev;
        }
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, feedback: 'timeout', streak: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.status, state.feedback]);

  useEffect(() => {
    if (state.status === 'active' && state.feedback === 'timeout' && state.currentQuestion) {
      playSound('timeout');
      const t = setTimeout(() => {
        setState(p => {
          if (p.status === 'idle') return p; 
          if (p.questionCount + 1 >= config.totalQuestions) return { ...p, status: 'finished', feedback: 'none' };
          nextQuestion();
          return { ...p, questionCount: p.questionCount + 1 };
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state.status, state.feedback, state.currentQuestion, config, nextQuestion]);

  return { config, setConfig, state, startQuiz, submitAnswer, quitQuiz };
};