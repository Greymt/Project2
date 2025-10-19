import React from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import Layout from '../components/layout';

const IndexPage: React.FC = () => {
  return (
    <Layout title="Trang Chủ">
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2 }}>
            Luyện Thi Trắc Nghiệm Tiếng Anh Online
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph sx={{ mb: 4 }}>
            Nâng cao kỹ năng tiếng Anh của bạn với hàng ngàn câu hỏi trắc nghiệm
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 6 }}>
            <Link href="/quiz" passHref>
              <Button component="a" variant="contained" size="large">
                Làm Bài Thi
              </Button>
            </Link>
            <Link href="/learning/topic1" passHref>
              <Button component="a" variant="outlined" size="large">
                Học Câu Hỏi
              </Button>
            </Link>
          </Box>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    1000+
                  </Typography>
                  <Typography variant="body2">Câu Hỏi</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    50+
                  </Typography>
                  <Typography variant="body2">Bài Thi</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    12+
                  </Typography>
                  <Typography variant="body2">Chủ Đề</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    24/7
                  </Typography>
                  <Typography variant="body2">Truy Cập</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;