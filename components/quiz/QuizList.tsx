import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import Link from 'next/link';
import { apiGet } from '../../utils/api';
import { Quiz, QuizResult } from '../../types/quiz';
import { PaginatedResponse } from '../../types/api';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch quizzes and results in parallel
        const [quizResponse, resultsResponse] = await Promise.all([
          apiGet<PaginatedResponse<Quiz>>('/api/quiz'),
          apiGet<Record<string, QuizResult>>('/api/quiz/results/user')
        ]);

        if (quizResponse.success && quizResponse.data) {
          setQuizzes(quizResponse.data.data);
        } else {
          setError(quizResponse.error || 'Không thể tải danh sách bài thi');
        }

        if (resultsResponse.success && resultsResponse.data) {
          setQuizResults(resultsResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Danh Sách Bài Thi
        </Typography>

        <Grid container spacing={3}>
          {quizzes?.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {quiz.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Thời gian:</strong> {quiz.duration} phút
                  </Typography>
                  <Typography variant="body2">
                    <strong>Điểm đạt:</strong> {quiz.passingScore}%
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                  {quizResults[quiz.id] ? (
                    <>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color={quizResults[quiz.id].score >= quiz.passingScore ? "success.main" : "error.main"}>
                          Điểm: {quizResults[quiz.id].score}%
                        </Typography>
                        <Link href={`/quiz/results/${quizResults[quiz.id].id}`} passHref>
                          <Button component="a" size="small">
                            Xem Chi Tiết
                          </Button>
                        </Link>
                      </Box>
                      <Link href={`/quiz/${quiz.id}`} passHref>
                        <Button component="a" size="small" variant="outlined" fullWidth>
                          Làm Lại
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href={`/quiz/${quiz.id}`} passHref>
                      <Button component="a" size="small" variant="contained" fullWidth>
                        Làm Bài Thi
                      </Button>
                    </Link>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {quizzes.length === 0 && (
          <Alert severity="info">Không có bài thi nào</Alert>
        )}
      </Box>
    </Container>
  );
};

export default QuizList;

