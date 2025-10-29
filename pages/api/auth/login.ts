import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { AuthResponse, LoginRequest } from '../../../types/user';
import { validateLoginForm } from '../../../utils/validation';
import { connectToDatabase } from '../../../utils/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AuthResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    const validation = validateLoginForm(email, password);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: JSON.stringify(validation.errors),
      });
    }

    // Connect to MongoDB and find user
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check password using bcrypt (expects stored password to be hashed)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Sign JWT
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user._id?.toString() ?? null, email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id?.toString() ?? null,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
          updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : undefined,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

