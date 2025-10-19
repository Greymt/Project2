import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { AuthResponse, LoginRequest } from '../../../types/user';
import { validateLoginForm } from '../../../utils/validation';

// Mock database - In production, use real database
const users: any[] = [
  {
    id: 'user1',
    email: 'user@example.com',
    password: 'Password123', // In production, this should be hashed
    fullName: 'Test User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    password: 'Admin123', // In production, this should be hashed
    fullName: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate mock token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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

