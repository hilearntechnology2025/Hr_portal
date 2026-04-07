import { Navigate, Outlet } from 'react-router-dom';

const ADMIN_ROLES = ['admin', 'super_admin'];

const AdminRoute = () => {
  const userRole = localStorage.getItem('userRole');

  if (!ADMIN_ROLES.includes(userRole)) {
    // Not an admin — redirect to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
