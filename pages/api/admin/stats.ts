import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { SystemStats } from '../../../types/api';
import { getUserFromRequest } from '../../../utils/auth';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SystemStats>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, error: 'Forbidden' });

    const { db } = await connectToDatabase();
    const totalUsers = await db.collection('users').countDocuments();
    const totalQuizzes = await db.collection('quizzes').countDocuments();
    const totalQuestions = await db.collection('questions').countDocuments();
    const totalResults = await db.collection('results').countDocuments();
    const topicsCount = await db.collection('topics').countDocuments();

    const avgRes = await db.collection('results').aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } }
    ]).toArray();
    const averageScore = avgRes[0]?.avg ?? 0;

    const stats: SystemStats = {
      totalUsers,
      totalQuizzes,
      totalQuestions,
      totalResults,
      averageScore,
      topicsCount,
      activeUsersToday: 0,
      activeUsersThisWeek: 0,
      activeUsersThisMonth: 0,
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

