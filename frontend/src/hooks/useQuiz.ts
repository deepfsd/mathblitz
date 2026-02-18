import { useState, useCallback, useEffect, useRef } from 'react';
import { quizApi } from '../api/quizApi';
import { playSound } from '../utils/sound';
import { QuizConfig, QuizState, AnswerResult } from '../types/quiz';

const INITIAL_STATE: QuizState = {
  status: 'idle',
  currentQuestion: null,
  score: 0,
  streak: 0,
  questionCount: 0,
  timeLeft: 0,
  feedback: null,
};

export const useQuiz = () => {
  const [config, setConfig] = useState<QuizConfig>({
    startTable: 2,
    endTable: 12,
    totalQuestions: 10,
    timePerQuestion: 10,
  });

  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startQuiz = useCallback(async () => {
    setState({ ...INITIAL_STATE, status: 'loading' });
    try {
      const q = await quizApi.getQuestion(config.startTable, config.endTable);
      startTimeRef.current = Date.now();
      
      setState((prev) => ({
        ...prev,
        status: 'active',
        currentQuestion: q,
        timeLeft: config.timePerQuestion,
      }));
    } catch (error) {
      console.error(error);
      setState((prev) => ({ ...prev, status: 'idle' }));
    }
  }, [config]);

  const quitQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(INITIAL_STATE);
  }, []);

  const nextQuestion = async (wasCorrect: boolean) => {
    const nextCount = state.questionCount + 1;
    
    // --- BUG FIX STARTS HERE ---
    // Check if the game is over
    if (nextCount >= config.totalQuestions) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      setState((prev) => ({ 
        ...prev, 
        status: 'finished',
        // IMPORTANT: We must update the score here for the LAST question
        score: wasCorrect ? prev.score + 1 : prev.score 
      }));
      return;
    }
    // --- BUG FIX ENDS HERE ---

    try {
      const q = await quizApi.getQuestion(config.startTable, config.endTable);
      startTimeRef.current = Date.now();

      setState((prev) => ({
        ...prev,
        currentQuestion: q,
        timeLeft: config.timePerQuestion,
        feedback: null, 
        streak: wasCorrect ? prev.streak + 1 : 0,
        score: wasCorrect ? prev.score + 1 : prev.score,
        questionCount: nextCount,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('wrong');

    if (state.currentQuestion) {
      const qText = `${state.currentQuestion.num1} × ${state.currentQuestion.num2}`;
      quizApi.logPerformance(qText, config.timePerQuestion, 'timeout');
    }

    setState(prev => ({ ...prev, feedback: 'timeout' }));
    
    setTimeout(() => {
      nextQuestion(false);
    }, 1500);
  }, [state.currentQuestion, config.totalQuestions]);

  const submitAnswer = async (answer: number) => {
    if (!state.currentQuestion || state.feedback) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    const qText = `${state.currentQuestion.num1} × ${state.currentQuestion.num2}`;

    try {
      const result = await quizApi.checkAnswer({
        num1: state.currentQuestion.num1,
        num2: state.currentQuestion.num2,
        user_answer: answer,
      });

      const resultType: AnswerResult = result.correct ? 'correct' : 'wrong';
      quizApi.logPerformance(qText, timeTaken, resultType);
      playSound(resultType);

      setState(prev => ({ ...prev, feedback: resultType }));

      if (result.correct) {
        setTimeout(() => {
          nextQuestion(true);
        }, 400);
      } else {
        setTimeout(() => {
          nextQuestion(false);
        }, 1500);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (state.status === 'active' && !state.feedback) {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.currentQuestion, state.feedback, handleTimeout]);

  return { config, setConfig, state, startQuiz, submitAnswer, quitQuiz };
};