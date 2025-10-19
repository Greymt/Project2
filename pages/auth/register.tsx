import React from 'react';
import Layout from '../../components/layout';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Layout title="Đăng Ký Tài Khoản">
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

