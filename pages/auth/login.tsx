import React from 'react';
import Layout from '../../components/layout';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout title="Đăng Nhập">
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;

