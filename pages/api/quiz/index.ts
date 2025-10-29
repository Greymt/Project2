import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, PaginatedResponse } from '../../../types/api';
import { Quiz } from '../../../types/quiz';
import { connectToDatabase } from '../../../utils/mongodb';

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
    const pageNum = parseInt(page as string) || 1;
    const pageSizeNum = Math.min(parseInt(pageSize as string) || 10, 100);

    const { db } = await connectToDatabase();
    const filter: any = {};
    if (topicId) filter.topicId = topicId as string;

    const total = await db.collection('quizzes').countDocuments(filter);
    const docs = await db.collection('quizzes').find(filter).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).toArray();
    const data = docs.map((d: any) => ({ id: d.id ?? d._id?.toString(), title: d.title, description: d.description, topicId: d.topicId, duration: d.duration, passingScore: d.passingScore, createdAt: d.createdAt }));
    const totalPages = Math.ceil(total / pageSizeNum);

    return res.status(200).json({ success: true, data: { data, total, page: pageNum, pageSize: pageSizeNum, totalPages } });
  } catch (error) {
    console.error('Get quizzes error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

