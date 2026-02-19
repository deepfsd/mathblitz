export interface Question {
  numbers: number[];
  operator: string;
  options: number[];
}

export interface QuizConfig {
  mode: 'multiplication' | 'addition';
  startTable: number;
  endTable: number;
  addDigits: number;
  addTermCount: number;
  timePerQuestion: number;
  totalQuestions: number;
}

export interface QuizState {
  status: 'idle' | 'loading' | 'active' | 'finished';
  currentQuestion: Question | null;
  score: number;
  streak: number;
  timeLeft: number;
  questionCount: number;
  feedback: 'none' | 'correct' | 'wrong' | 'timeout';
}

export interface PerformanceLog {
  id: string;
  question: string;
  result: 'correct' | 'wrong' | 'timeout';
  timeTaken: number;
  date: string;
}