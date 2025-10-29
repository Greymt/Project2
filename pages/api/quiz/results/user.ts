import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '../../../../types/api';
import { QuizResult } from '../../../../types/quiz';
import { connectToDatabase } from '../../../../utils/mongodb';
import { getUserFromRequest } from '../../../../utils/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<Record<string, QuizResult>>>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        });
    }

    try {
        const user = await getUserFromRequest(req);
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const { db } = await connectToDatabase();
        const results = await db.collection('results')
            .find({ userId: user._id?.toString() ?? user.id })
            .sort({ completedAt: -1 }) // Get latest attempt for each quiz
            .toArray();

        // Create a map of quizId to latest result
        const resultMap: Record<string, any> = {};
        results.forEach(result => {
            const id = result.id ?? result._id?.toString();
            // Only keep the latest attempt for each quiz
            if (!resultMap[result.quizId] || new Date(result.completedAt) > new Date(resultMap[result.quizId].completedAt)) {
                resultMap[result.quizId] = {
                    id,
                    quizId: result.quizId,
                    userId: result.userId,
                    score: result.score,
                    totalQuestions: result.totalQuestions,
                    answers: result.answers,
                    startedAt: result.startedAt,
                    completedAt: result.completedAt
                };
            }
        });

        return res.status(200).json({ success: true, data: resultMap });
    } catch (error) {
        console.error('Get user results error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}