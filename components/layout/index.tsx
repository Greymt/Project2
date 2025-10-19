import React, { PropsWithChildren } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import { AppState } from '../../app/store';
import { logout } from '../../app/slices/authSlice';
import { isAdmin } from '../../utils/auth';
import SEO, { SEOProps } from './SEO';

export default function Layout(props: PropsWithChildren<SEOProps>) {
  const { children, ...seoProps } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: AppState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    router.push('/auth/login');
  };

  return (
    <>
      <SEO {...seoProps} />
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Typography
              variant="h6"
              component="a"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              📚 Quiz Online
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                <Link href="/quiz" passHref>
                  <Button color="inherit" component="a">
                    Bài Thi
                  </Button>
                </Link>
                <Link href="/learning/topic1" passHref>
                  <Button color="inherit" component="a">
                    Học
                  </Button>
                </Link>
                {isAdmin(user) && (
                  <Link href="/admin/dashboard" passHref>
                    <Button color="inherit" component="a">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button color="inherit" onClick={handleMenuOpen}>
                  {user.fullName}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Đăng Xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/auth/login" passHref>
                  <Button color="inherit" component="a">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/auth/register" passHref>
                  <Button color="inherit" component="a">
                    Đăng Ký
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <div id="main">
        <Container maxWidth="lg">{children}</Container>
      </div>
    </>
  );
}