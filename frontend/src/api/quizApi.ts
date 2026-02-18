import axios from 'axios';
import { Question, PerformanceLog, AnswerResult } from '../types/quiz';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const quizApi = {
  getQuestion: async (start: number, end: number): Promise<Question> => {
    const response = await apiClient.get<Question>(`/question`, {
      params: { start, end },
    });
    return response.data;
  },

  checkAnswer: async (payload: { num1: number; num2: number; user_answer: number }) => {
    const response = await apiClient.post(`/check`, payload);
    return response.data;
  },

  logPerformance: (question: string, timeTaken: number, result: AnswerResult) => {
    let history: PerformanceLog[] = JSON.parse(localStorage.getItem('quiz_performance') || '[]');
    
    // Logic: Remove existing entry for this question if it exists, so we can push the new result
    // This ensures we don't have duplicates and always have the latest status
    history = history.filter(item => item.question !== question);
    
    const newEntry: PerformanceLog = {
      id: crypto.randomUUID(),
      question,
      timeTaken: parseFloat(timeTaken.toFixed(2)),
      date: new Date().toLocaleDateString(),
      result,
    };

    // Add to end (we will reverse it in UI to show latest first)
    history.push(newEntry);

    localStorage.setItem('quiz_performance', JSON.stringify(history));
  },

  getHistory: (): PerformanceLog[] => {
    return JSON.parse(localStorage.getItem('quiz_performance') || '[]');
  },

  clearHistory: () => {
    localStorage.removeItem('quiz_performance');
  }
};