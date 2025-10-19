import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { SystemStats } from '../../../types/api';

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
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Mock stats data
    const stats: SystemStats = {
      totalUsers: 1250,
      totalQuizzes: 45,
      totalQuestions: 1200,
      totalResults: 5680,
      averageScore: 72.5,
      topicsCount: 12,
      activeUsersToday: 145,
      activeUsersThisWeek: 890,
      activeUsersThisMonth: 3450,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

