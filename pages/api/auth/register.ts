import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { AuthResponse, RegisterRequest } from '../../../types/user';
import { validateRegisterForm } from '../../../utils/validation';

// Mock database - In production, use real database
const users: any[] = [];

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

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Create new user (mock)
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, hash the password
      fullName,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate mock token
    const token = Buffer.from(JSON.stringify({ userId: newUser.id, email })).toString('base64');

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
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

