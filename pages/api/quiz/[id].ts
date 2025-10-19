import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { Quiz, Question } from '../../../types/quiz';

// Mock database
const quizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'TOEIC - Part 1: Photographs',
    description: 'Luyện thi TOEIC phần 1 - Nhìn hình và trả lời câu hỏi',
    topicId: 'topic1',
    duration: 15,
    passingScore: 70,
    createdAt: new Date().toISOString(),
  },
];

const questions: Question[] = [
  {
    id: 'q1',
    topicId: 'topic1',
    question: 'What is the man doing?',
    optionA: 'He is reading a book',
    optionB: 'He is writing on the board',
    optionC: 'He is sitting at a desk',
    optionD: 'He is standing by the window',
    correctAnswer: 'B',
    explanation: 'The image shows a man writing on the board.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q2',
    topicId: 'topic1',
    question: 'Where are the people?',
    optionA: 'In a classroom',
    optionB: 'In a library',
    optionC: 'In an office',
    optionD: 'In a restaurant',
    correctAnswer: 'A',
    explanation: 'The setting appears to be a classroom with a board.',
    createdAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Quiz>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { id } = req.query;

    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    // Get questions for this quiz
    const quizQuestions = questions.filter((q) => q.topicId === quiz.topicId);

    return res.status(200).json({
      success: true,
      data: {
        ...quiz,
        questions: quizQuestions,
      },
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

