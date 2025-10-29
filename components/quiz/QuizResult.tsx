import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  Alert,
  LinearProgress,
  Grid,
} from '@mui/material';
import Link from 'next/link';
import { apiGet } from '../../utils/api';
import { QuizResult } from '../../types/quiz';

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} giây`;
  } else if (seconds === 0) {
    return `${minutes} phút`;
  } else {
    return `${minutes} phút ${seconds} giây`;
  }
};

const QuizResultComponent: React.FC<{ resultId: string }> = ({ resultId }) => {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<QuizResult>(`/api/quiz/results/${resultId}`);

        if (response.success && response.data) {
          setResult(response.data);
        } else {
          setError(response.error || 'Không thể tải kết quả');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!result) {
    return <Alert severity="warning">Không tìm thấy kết quả</Alert>;
  }

  const percentage = result.score;
  const isPassed = percentage >= 70;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Card sx={{ mb: 3, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {isPassed ? '🎉 Chúc mừng!' : '😢 Tiếc quá!'}
            </Typography>
            <Typography variant="h2" color={isPassed ? 'success' : 'error'} gutterBottom>
              {percentage}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              Bạn trả lời đúng {Math.round((result.score * result.totalQuestions) / 100)}/{result.totalQuestions} câu
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {isPassed ? 'Bạn đã vượt qua bài thi!' : 'Bạn chưa đạt điểm yêu cầu. Hãy thử lại!'}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Tổng số câu
                </Typography>
                <Typography variant="h5">{result.totalQuestions}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Thời gian làm bài
                </Typography>
                <Typography variant="h5">
                  {formatTime(new Date(result.completedAt).getTime() - new Date(result.startedAt).getTime())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Link href="/quiz" passHref>
            <Button component="a" variant="contained">
              Quay Lại Danh Sách
            </Button>
          </Link>
          <Link href={`/quiz/${result.quizId}`} passHref>
            <Button component="a" variant="outlined">
              Làm Lại
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default QuizResultComponent;

