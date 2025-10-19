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
import { Quiz } from '../../types/quiz';
import { PaginatedResponse } from '../../types/api';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<PaginatedResponse<Quiz>>('/api/quiz');
        console.log('Response:', response);

        if (response.success && response.data) {
          setQuizzes(response.data.data);
        } else {
          setError(response.error || 'Không thể tải danh sách bài thi');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
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
                <CardActions>
                  <Link href={`/quiz/${quiz.id}`} passHref>
                    <Button component="a" size="small" variant="contained">
                      Làm Bài Thi
                    </Button>
                  </Link>
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

