export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  QUIZ: '/quiz',
  QUIZ_DETAIL: (id: string) => `/quiz/${id}`,
  QUIZ_RESULT: (id: string) => `/quiz/results/${id}`,
  LEARNING: '/learning',
  LEARNING_TOPIC: (topic: string) => `/learning/${topic}`,
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_QUIZZES: '/admin/quizzes',
  ADMIN_USERS: '/admin/users',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const QUIZ_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const ANSWER_OPTIONS = ['A', 'B', 'C', 'D'] as const;

export const MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  REGISTER_FAILED: 'Đăng ký thất bại',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  QUIZ_SUBMITTED: 'Bài thi đã được gửi',
  QUIZ_SUBMIT_FAILED: 'Gửi bài thi thất bại',
  LOADING: 'Đang tải...',
  ERROR: 'Có lỗi xảy ra',
  SUCCESS: 'Thành công',
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email không được để trống',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  FULLNAME_REQUIRED: 'Tên đầy đủ không được để trống',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const QUIZ_CONFIG = {
  MIN_DURATION: 5, // minutes
  MAX_DURATION: 180, // minutes
  MIN_PASSING_SCORE: 0, // percentage
  MAX_PASSING_SCORE: 100, // percentage
};

