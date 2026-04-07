import { Navigate, Outlet } from 'react-router-dom';

// Allows manager and above roles
const MANAGER_ROLES = ['manager', 'admin', 'super_admin'];

const ManagerRoute = () => {
    const userRole = localStorage.getItem('userRole');

    if (!MANAGER_ROLES.includes(userRole)) {
        // Not a manager — redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ManagerRoute;