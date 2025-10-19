import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  Alert,
  Grid,
  Button,
} from '@mui/material';
import { apiGet } from '../../utils/api';
import { Question, Topic } from '../../types/quiz';
import { PaginatedResponse } from '../../types/api';

const TopicLearning: React.FC<{ topicId: string }> = ({ topicId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch topics to find the current one
        const topicsResponse = await apiGet<Topic[]>('/api/questions/topics');
        if (topicsResponse.success && topicsResponse.data) {
          const currentTopic = topicsResponse.data.find((t) => t.id === topicId);
          setTopic(currentTopic || null);
        }

        // Fetch questions for this topic
        const questionsResponse = await apiGet<PaginatedResponse<Question>>(
          `/api/questions?topicId=${topicId}&pageSize=100`
        );

        if (questionsResponse.success && questionsResponse.data) {
          setQuestions(questionsResponse.data.data);
        } else {
          setError(questionsResponse.error || 'Không thể tải câu hỏi');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

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
          {topic?.name || 'Học Câu Hỏi'}
        </Typography>

        {topic?.description && (
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {topic.description}
          </Typography>
        )}

        <Grid container spacing={2}>
          {questions.map((question, index) => (
            <Grid item xs={12} key={question.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setExpandedQuestion(expandedQuestion === question.id ? null : question.id)
                    }
                  >
                    <Typography variant="h6">
                      Câu {index + 1}: {question.question}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {expandedQuestion === question.id ? '▼' : '▶'}
                    </Typography>
                  </Box>

                  {expandedQuestion === question.id && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>A.</strong> {question.optionA}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>B.</strong> {question.optionB}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>C.</strong> {question.optionC}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>D.</strong> {question.optionD}
                      </Typography>

                      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Đáp án đúng:</strong> {question.correctAnswer}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Giải thích:</strong> {question.explanation}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {questions.length === 0 && (
          <Alert severity="info">Không có câu hỏi nào cho chủ đề này</Alert>
        )}
      </Box>
    </Container>
  );
};

export default TopicLearning;

