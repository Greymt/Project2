import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { apiGet, apiPost } from '../../utils/api';
import { Quiz, UserAnswer } from '../../types/quiz';
import { setCurrentQuiz, setCurrentQuestion, addUserAnswer, setTimeRemaining } from '../../app/slices/quizSlice';
import { AppState } from '../../app/store';

const QuizPlayer: React.FC<{ quizId: string }> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { currentQuestion, userAnswers, timeRemaining } = useSelector((state: AppState) => state.quiz);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<Quiz>(`/api/quiz/${quizId}`);

        if (response.success && response.data) {
          setQuiz(response.data);
          dispatch(setCurrentQuiz(response.data));
        } else {
          setError(response.error || 'Không thể tải bài thi');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, dispatch]);

  // Timer effect
  useEffect(() => {
    if (!quiz || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      dispatch(setTimeRemaining(timeRemaining - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeRemaining, dispatch]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    dispatch(addUserAnswer({
      questionId,
      selectedAnswer: answer as 'A' | 'B' | 'C' | 'D',
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      const response = await apiPost<{ id: string }>('/api/quiz/submit', {
        quizId: quiz.id,
        answers: userAnswers,
        timeSpent: quiz.duration * 60 - timeRemaining,
      });

      if (response.success && response.data) {
        router.push(`/quiz/results/${response.data.id}`);
      } else {
        setError(response.error || 'Không thể gửi bài thi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <Alert severity="warning">Không có câu hỏi nào</Alert>;
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Câu {currentQuestion + 1}/{quiz.questions.length}
          </Typography>
          <Typography variant="h6" color={timeRemaining < 300 ? 'error' : 'inherit'}>
            Thời gian: {minutes}:{seconds.toString().padStart(2, '0')}
          </Typography>
        </Box>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {question.question}
            </Typography>

            <RadioGroup
              value={userAnswers.find((a) => a.questionId === question.id)?.selectedAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {['A', 'B', 'C', 'D'].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={`${option}. ${question[`option${option}` as keyof typeof question]}`}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => dispatch(setCurrentQuestion(Math.max(0, currentQuestion - 1)))}
            disabled={currentQuestion === 0}
          >
            Câu Trước
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Nộp Bài'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => dispatch(setCurrentQuestion(currentQuestion + 1))}
            >
              Câu Tiếp
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default QuizPlayer;

