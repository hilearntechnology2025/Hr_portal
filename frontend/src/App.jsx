import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import ManagerRoute from './components/Common/ManagerRoute';
import HrRoute from './components/Common/HrRoute';
import EmployeeRoute from './components/Common/EmployeeRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CallLogs from './pages/CallLogs';
import Reports from './pages/Reports';
import EmployeePunch from './pages/EmployeePunch';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminAttendance from './pages/admin/AdminAttendance';


// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerTeam from './pages/manager/ManagerTeam';
import ManagerProfile from './pages/manager/ManagerProfile';
import ManagerTargets from './pages/manager/ManagerTargets';

// HR Pages 
import HrDashboard from './pages/hr/HrDashboard';
import HrEmployees from './pages/hr/HrEmployees';
import HrLeaves from './pages/hr/HrLeaves';
import HrAttendance from './pages/hr/HrAttendance';
import HrProfile from './pages/hr/HrProfile';

// Employee Pages
import EmployeeLeaves from './pages/employee/EmployeeLeaves';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

  // Listen for storage changes (logout from any tab or component)
  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    // Custom event for same-tab logout
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes with Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* Regular User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-logs" element={<CallLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/attendance" element={<EmployeePunch />} />

            {/* Employee-Only Routes */}
            <Route element={<EmployeeRoute />}>
              <Route path="/my-leaves" element={<EmployeeLeaves />} />
            </Route>

            {/* Manager-Only Routes */}
            <Route element={<ManagerRoute />}>
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/team" element={<ManagerTeam />} />
              <Route path="/manager/profile" element={<ManagerProfile />} />
              <Route path="/manager/targets" element={<ManagerTargets />} />
            </Route>

            {/* HR-Only Routes ←  */}
            <Route element={<HrRoute />}>
              <Route path="/hr" element={<HrDashboard />} />
              <Route path="/hr/employees" element={<HrEmployees />} />
              <Route path="/hr/leaves" element={<HrLeaves />} />
              <Route path="/hr/attendance" element={<HrAttendance />} />
              <Route path="/hr/profile" element={<HrProfile />} />
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/leaves" element={<AdminLeaves />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
            </Route>
          </Route>
        </Route>

        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;