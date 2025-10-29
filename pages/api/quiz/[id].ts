import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../types/api';
import { Quiz, Question } from '../../../types/quiz';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Quiz>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { id } = req.query;
    const { db } = await connectToDatabase();
    const quiz = await db.collection('quizzes').findOne({ id: id as string });
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    const quizQuestions = await db.collection('questions').find({ topicId: quiz.topicId }).toArray();
    const questionsMapped = quizQuestions.map((d: any) => ({
      id: d.id ?? d._id?.toString(),
      topicId: d.topicId,
      question: d.question,
      optionA: d.optionA,
      optionB: d.optionB,
      optionC: d.optionC,
      optionD: d.optionD,
      correctAnswer: d.correctAnswer,
      explanation: d.explanation,
      createdAt: d.createdAt,
    }));
    const mappedQuiz: Quiz = {
      id: quiz.id ?? quiz._id?.toString(),
      title: quiz.title,
      description: quiz.description,
      topicId: quiz.topicId,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      createdAt: quiz.createdAt,
      questions: questionsMapped,
    };

    return res.status(200).json({ success: true, data: mappedQuiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

