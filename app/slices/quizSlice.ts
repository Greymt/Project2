import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, Quiz, UserAnswer } from '../../types/quiz';

const initialState: QuizState = {
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  isLoading: false,
  error: null,
  timeRemaining: 0,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.currentQuestion = 0;
      state.userAnswers = [];
      state.timeRemaining = action.payload.duration * 60; // convert to seconds
      state.error = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestion = action.payload;
    },
    addUserAnswer: (state, action: PayloadAction<UserAnswer>) => {
      const existingIndex = state.userAnswers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      if (existingIndex >= 0) {
        state.userAnswers[existingIndex] = action.payload;
      } else {
        state.userAnswers.push(action.payload);
      }
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestion = 0;
      state.userAnswers = [];
      state.timeRemaining = 0;
      state.error = null;
    },
  },
});

export const {
  setCurrentQuiz,
  setCurrentQuestion,
  addUserAnswer,
  setTimeRemaining,
  setLoading,
  setError,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;

