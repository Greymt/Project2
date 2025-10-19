import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '../../app/slices/authSlice';
import { apiPost } from '../../utils/api';
import { setAuthToken, setAuthUser } from '../../utils/auth';
import { validateLoginForm } from '../../utils/validation';
import { AuthResponse } from '../../types/user';
import Link from 'next/link';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoadingLocal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoadingLocal(true);
    dispatch(setLoading(true));

    try {
      const response = await apiPost<AuthResponse>('/api/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));
        setAuthToken(response.data.token);
        setAuthUser(response.data.user);

        router.push('/');
      } else {
        setApiError(response.error || 'Đăng nhập thất bại');
        dispatch(setError(response.error || 'Đăng nhập thất bại'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setApiError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setIsLoadingLocal(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Đăng Nhập
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            disabled={isLoading}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Đăng Nhập'}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" passHref>
              <MuiLink component="a" sx={{ cursor: 'pointer' }}>
                Đăng ký ngay
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;

