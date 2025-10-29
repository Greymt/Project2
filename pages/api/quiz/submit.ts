import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { QuizResult, QuizSubmitRequest, UserAnswer } from '../../../types/quiz';
import { connectToDatabase } from '../../../utils/mongodb';
import { getUserFromRequest } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<QuizResult>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { quizId, answers, timeSpent }: QuizSubmitRequest = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { db } = await connectToDatabase();
    const questionIds = answers.map((a: UserAnswer) => a.questionId);
    const docs = await db.collection('questions').find({ id: { $in: questionIds } }).toArray();
    const map: Record<string, any> = {};
    docs.forEach((d: any) => { map[d.id ?? d._id?.toString()] = d; });

    let correctCount = 0;
    answers.forEach((answer: UserAnswer) => {
      const q = map[answer.questionId];
      if (q && answer.selectedAnswer === q.correctAnswer) correctCount++;
    });

    const score = Math.round((correctCount / answers.length) * 100);

    const resultDoc = {
      id: new ObjectId().toString(), // Add id before saving
      quizId,
      userId: user._id?.toString() ?? user.id,
      score,
      totalQuestions: answers.length,
      answers,
      startedAt: new Date(Date.now() - (timeSpent || 0) * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    } as any;

    const insert = await db.collection('results').insertOne(resultDoc);
    resultDoc.id = insert.insertedId?.toString();

    return res.status(201).json({ success: true, data: resultDoc });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

