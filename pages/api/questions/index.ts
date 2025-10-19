import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, PaginatedResponse } from '../../../types/api';
import { Question } from '../../../types/quiz';

// Mock database
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
  {
    id: 'q3',
    topicId: 'topic2',
    question: 'What does "ubiquitous" mean?',
    optionA: 'Rare and uncommon',
    optionB: 'Present everywhere',
    optionC: 'Very expensive',
    optionD: 'Difficult to understand',
    correctAnswer: 'B',
    explanation: 'Ubiquitous means present, appearing, or found everywhere.',
    createdAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<Question>>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { page = 1, pageSize = 10, topicId } = req.query;

    let filtered = questions;

    // Filter by topic if provided
    if (topicId) {
      filtered = filtered.filter((q) => q.topicId === topicId);
    }

    const pageNum = parseInt(page as string) || 1;
    const pageSizeNum = Math.min(parseInt(pageSize as string) || 10, 100);

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSizeNum);
    const start = (pageNum - 1) * pageSizeNum;
    const data = filtered.slice(start, start + pageSizeNum);

    return res.status(200).json({
      success: true,
      data: {
        data,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get questions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

