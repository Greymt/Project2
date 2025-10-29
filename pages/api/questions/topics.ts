import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { Topic } from '../../../types/quiz';
import { connectToDatabase } from '../../../utils/mongodb';

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
    const { db } = await connectToDatabase();
    const docs = await db.collection('topics').find({}).toArray();
    const topics = docs.map((d: any) => ({ id: d.id ?? d._id?.toString(), name: d.name, description: d.description, createdAt: d.createdAt }));
    return res.status(200).json({ success: true, data: topics });
  } catch (error) {
    console.error('Get topics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

