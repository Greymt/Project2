import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { User } from '../../../types/user';
import { connectToDatabase } from '../../../utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
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

    const token = authHeader.substring(7);
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId?: string };
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const { db } = await connectToDatabase();
      // try id field first
      let user = await db.collection('users').findOne({ id: decoded.userId });
      if (!user) {
        try {
          user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
        } catch (e) {
          // ignore
        }
      }

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.status(200).json({
        success: true, data: {
          id: user._id?.toString() ?? user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

