  export interface Question {
    numbers: number[]; // Swapped num1/num2 for an array of numbers
    operator: string;
    options: number[];
  }

export interface QuizConfig {
  mode: 'multiplication' | 'addition';
  startTable: number;
  endTable: number;
  addDigits: number;    // NEW: Just one setting for digit count
  addTermCount: number; // How many numbers to add together
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