import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Layout from '../../components/layout';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const AdminQuizzesPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Quản Lý Bài Thi">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Quản Lý Bài Thi
            </Typography>
            <Typography variant="body1">
              Tính năng quản lý bài thi sẽ được phát triển trong phiên bản tiếp theo.
            </Typography>
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminQuizzesPage;

