import React from 'react';
import Layout from '../../components/layout';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Bảng Điều Khiển Quản Trị">
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;

