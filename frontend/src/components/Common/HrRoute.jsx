import { Navigate, Outlet } from 'react-router-dom';

// Allows HR and above roles
const HR_ROLES = ['hr', 'admin', 'super_admin'];

const HrRoute = () => {
    const userRole = localStorage.getItem('userRole');

    if (!HR_ROLES.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default HrRoute;