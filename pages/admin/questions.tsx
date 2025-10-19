import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Layout from '../../components/layout';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const AdminQuestionsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Quản Lý Câu Hỏi">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Quản Lý Câu Hỏi
            </Typography>
            <Typography variant="body1">
              Tính năng quản lý câu hỏi sẽ được phát triển trong phiên bản tiếp theo.
            </Typography>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminQuestionsPage;

