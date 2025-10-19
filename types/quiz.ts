export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topicId: string;
  duration: number; // in minutes
  passingScore: number; // percentage
  questions?: Question[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionId: string;
  order: number;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  startedAt: string;
  completedAt: string;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestion: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
}

export interface QuizSubmitRequest {
  quizId: string;
  answers: UserAnswer[];
  timeSpent: number;
}

