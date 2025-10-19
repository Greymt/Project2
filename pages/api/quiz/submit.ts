import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { QuizResult, QuizSubmitRequest, UserAnswer } from '../../../types/quiz';

// Mock database
const questions: any[] = [
  {
    id: 'q1',
    correctAnswer: 'B',
  },
  {
    id: 'q2',
    correctAnswer: 'A',
  },
];

const results: QuizResult[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<QuizResult>>
) {
  if (req.method !== 'POST') {
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

    const { quizId, answers, timeSpent }: QuizSubmitRequest = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
      });
    }

    // Calculate score
    let correctCount = 0;
    answers.forEach((answer: UserAnswer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && answer.selectedAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / answers.length) * 100);

    // Create result
    const result: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1', // In production, get from token
      quizId,
      score,
      totalQuestions: answers.length,
      answers,
      startedAt: new Date(Date.now() - timeSpent * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    };

    results.push(result);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

