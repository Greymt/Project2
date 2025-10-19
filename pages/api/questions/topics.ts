import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { Topic } from '../../../types/quiz';

// Mock database
const topics: Topic[] = [
  {
    id: 'topic1',
    name: 'TOEIC Listening',
    description: 'Luyện thi TOEIC phần Listening',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic2',
    name: 'TOEIC Reading',
    description: 'Luyện thi TOEIC phần Reading',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic3',
    name: 'IELTS Reading',
    description: 'Luyện thi IELTS phần Reading',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic4',
    name: 'IELTS Writing',
    description: 'Luyện thi IELTS phần Writing',
    createdAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Topic[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error('Get topics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

