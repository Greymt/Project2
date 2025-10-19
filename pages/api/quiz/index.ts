import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, PaginatedResponse } from '../../../types/api';
import { Quiz } from '../../../types/quiz';

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
  {
    id: 'quiz2',
    title: 'TOEIC - Part 2: Question-Response',
    description: 'Luyện thi TOEIC phần 2 - Nghe câu hỏi và chọn câu trả lời',
    topicId: 'topic1',
    duration: 20,
    passingScore: 70,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'quiz3',
    title: 'IELTS - Reading',
    description: 'Luyện thi IELTS phần Reading',
    topicId: 'topic2',
    duration: 60,
    passingScore: 65,
    createdAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<Quiz>>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { page = 1, pageSize = 10, topicId } = req.query;

    let filtered = quizzes;

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
        data: data,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

