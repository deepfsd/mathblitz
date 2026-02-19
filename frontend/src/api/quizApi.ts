import axios from 'axios';
import { QuizConfig, PerformanceLog } from '../types/quiz';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const HISTORY_KEY = 'mathblitz_history';

export const quizApi = {
  getQuestion: async (config: QuizConfig) => {
    try {
      if (config.mode === 'addition') {
        const response = await axios.get(
          `${API_URL}/question/addition?digits=${config.addDigits}&terms=${config.addTermCount}`
        );
        return response.data;
      } else {
        const response = await axios.get(
          `${API_URL}/question/multiplication?start=${config.startTable}&end=${config.endTable}`
        );
        return response.data;
      }
    } catch (error) {
      console.error("API Error fetching question:", error);
      throw error;
    }
  },

  checkAnswer: async (numbers: number[], answer: number, mode: string) => {
    try {
      const response = await axios.post(`${API_URL}/check?mode=${mode}`, {
        numbers,
        user_answer: answer
      });
      return response.data;
    } catch (error) {
      console.error("API Error checking answer:", error);
      throw error;
    }
  },

  getHistory: (): PerformanceLog[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHistory: (log: PerformanceLog) => {
    const history = quizApi.getHistory();
    const updated = [...history, log];
    if (updated.length > 50) updated.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
  }
};