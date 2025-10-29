import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../../types/api';
import { QuizResult } from '../../../../types/quiz';
import { connectToDatabase } from '../../../../utils/mongodb';
import { getUserFromRequest } from '../../../../utils/auth';
import { ObjectId } from 'mongodb';

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
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { id } = req.query;
    const { db } = await connectToDatabase();
    const result = await db.collection('results').findOne({
      $or: [
        { id: id as string },
        { _id: new ObjectId(id as string) }
      ]
    });
    if (!result) return res.status(404).json({ success: false, error: 'Result not found' });

    const userId = user._id?.toString() ?? user.id;
    if (result.userId !== userId) return res.status(403).json({ success: false, error: 'Forbidden' });

    const mapped: QuizResult = {
      id: result.id ?? result._id?.toString(),
      userId: result.userId,
      quizId: result.quizId,
      score: result.score,
      totalQuestions: result.totalQuestions,
      answers: result.answers,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
    };

    return res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Get result error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

