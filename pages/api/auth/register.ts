import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { AuthResponse, RegisterRequest } from '../../../types/user';
import { validateRegisterForm } from '../../../utils/validation';
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
    const { email, password, confirmPassword, fullName }: RegisterRequest = req.body;

    // Validate input
    const validation = validateRegisterForm(email, password, confirmPassword, fullName);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: JSON.stringify(validation.errors),
      });
    }

    // Check if user already exists in DB
    const { db } = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const now = new Date().toISOString();
    const insertRes = await db.collection('users').insertOne({
      email,
      password: hashed,
      fullName,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    });

    const userId = insertRes.insertedId?.toString() ?? null;

    // Sign JWT
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const token = jwt.sign({ userId, email }, jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          fullName,
          role: 'user',
          createdAt: now,
          updatedAt: now,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

