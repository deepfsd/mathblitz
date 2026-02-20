import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizConfig, QuizState } from '../types/quiz';
import { quizApi } from '../api/quizApi';

// --- ROBUST AUDIO CONTROLLER ---
// Created outside the component so they are preloaded once
const correctAudio = new Audio('sounds/correct.mp3');
const incorrectAudio = new Audio('sounds/incorrect.mp3');

// Preload the audio files so there is no delay on the first click
correctAudio.preload = 'auto';
incorrectAudio.preload = 'auto';

const playSound = (type: 'correct' | 'wrong' | 'timeout') => {
  try {
    if (type === 'correct') {
      correctAudio.currentTime = 0; // Reset to start so it fires instantly even if already playing
      correctAudio.play().catch(e => console.log("Audio blocked by browser:", e));
    } else {
      incorrectAudio.currentTime = 0; // Reset to start
      incorrectAudio.play().catch(e => console.log("Audio blocked by browser:", e));
    }
  } catch (error) {
    console.error("Audio playback error", error);
  }
};
// -------------------------------

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
    
    // Trick browsers into unlocking audio context by playing a silent sound on Start
    incorrectAudio.volume = 0;
    incorrectAudio.play().then(() => {
        incorrectAudio.pause();
        incorrectAudio.currentTime = 0;
        incorrectAudio.volume = 1;
    }).catch(() => {});

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

      // 🔥 FIRE THE SOUND EFFECT INSTANTLY
      playSound(isCorrect ? 'correct' : 'wrong');

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
      }, 300);

    } catch (error) {
      console.error("Failed to check answer:", error);
    }
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
      const operator = config.mode === 'addition' ? '+' : '×';
      
      // 🔥 FIRE TIMEOUT SOUND
      playSound('timeout');

      quizApi.saveHistory({
        id: Date.now().toString(),
        question: state.currentQuestion.numbers.join(` ${operator} `),
        result: 'timeout',
        timeTaken: config.timePerQuestion,
        date: new Date().toLocaleDateString('en-GB')
      });

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
      }, 300);

      return () => clearTimeout(t);
    }
  }, [state.status, state.feedback, state.currentQuestion, config, nextQuestion]);

  return { config, setConfig, state, startQuiz, submitAnswer, quitQuiz };
};