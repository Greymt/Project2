export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SystemStats {
  totalUsers: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalResults: number;
  averageScore: number;
  topicsCount: number;
  activeUsersToday: number;
  activeUsersThisWeek: number;
  activeUsersThisMonth: number;
}

export interface UserStats {
  userId: string;
  totalQuizzesTaken: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalTimeSpent: number; // in minutes
  topicScores: {
    topicId: string;
    topicName: string;
    averageScore: number;
    quizzesTaken: number;
  }[];
}

