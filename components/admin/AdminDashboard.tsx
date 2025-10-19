import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { apiGet } from '../../utils/api';
import { SystemStats } from '../../types/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<SystemStats>('/api/admin/stats');

        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Không thể tải thống kê');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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

  if (!stats) {
    return <Alert severity="warning">Không có dữ liệu</Alert>;
  }

  const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Bảng Điều Khiển Quản Trị
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tổng Người Dùng" value={stats.totalUsers} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tổng Bài Thi" value={stats.totalQuizzes} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tổng Câu Hỏi" value={stats.totalQuestions} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tổng Kết Quả" value={stats.totalResults} />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Điểm Trung Bình" value={`${stats.averageScore.toFixed(1)}%`} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tổng Chủ Đề" value={stats.topicsCount} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Người Dùng Hôm Nay" value={stats.activeUsersToday} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Người Dùng Tuần Này" value={stats.activeUsersThisWeek} />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Người Dùng Tháng Này
            </Typography>
            <Typography variant="h4">{stats.activeUsersThisMonth}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

