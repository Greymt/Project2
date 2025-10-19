import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../../types/api';
import { QuizResult } from '../../../../types/quiz';

// Mock database
const results: QuizResult[] = [
  {
    id: 'result1',
    userId: 'user1',
    quizId: 'quiz1',
    score: 85,
    totalQuestions: 10,
    answers: [
      { questionId: 'q1', selectedAnswer: 'B' },
      { questionId: 'q2', selectedAnswer: 'A' },
    ],
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<QuizResult>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { id } = req.query;

    const result = results.find((r) => r.id === id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Result not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get result error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

