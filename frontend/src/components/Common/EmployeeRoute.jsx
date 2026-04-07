import { Navigate, Outlet } from 'react-router-dom';

const EmployeeRoute = () => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'employee') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default EmployeeRoute;