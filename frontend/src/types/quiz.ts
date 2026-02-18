export interface Question {
  num1: number;
  num2: number;
  options: number[];
}

export interface QuizConfig {
  startTable: number;
  endTable: number;
  totalQuestions: number;
  timePerQuestion: number;
}

export type AnswerResult = 'correct' | 'wrong' | 'timeout';

export interface PerformanceLog {
  id: string;
  question: string;
  timeTaken: number;
  date: string;
  result: AnswerResult;
}

export interface QuizState {
  status: 'idle' | 'loading' | 'active' | 'finished';
  currentQuestion: Question | null;
  score: number;
  streak: number;
  questionCount: number;
  timeLeft: number;
  feedback: AnswerResult | null;
}