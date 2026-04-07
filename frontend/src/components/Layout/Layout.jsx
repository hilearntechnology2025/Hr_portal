// import { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';

// const Layout = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     return (
//         <div className="flex h-screen bg-gray-50 overflow-hidden">

//             {/* Sidebar — reusable component */}
//             <Sidebar
//                 isOpen={sidebarOpen}
//                 onClose={() => setSidebarOpen(false)}
//             />

//             {/* Main Content Area */}
//             <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//                 {/* Header/Navbar — reusable component */}
//                 <Header onMenuClick={() => setSidebarOpen(true)} />

//                 {/* Page Content */}
//                 <main className="flex-1 overflow-y-auto p-4 lg:p-6">
//                     <Outlet />
//                 </main>

//             </div>
//         </div>
//     );
// };

// export default Layout;
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

import AdminSidebar from './AdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import HrSidebar from './HrSidebar';
import EmployeeSidebar from './EmployeeSidebar';
import Sidebar from './Sidebar'; // fallback for agent/team_leader etc.

const getRoleSidebar = (role) => {
  if (['admin', 'super_admin'].includes(role)) return AdminSidebar;
  if (role === 'manager') return ManagerSidebar;
  if (role === 'hr') return HrSidebar;
  if (role === 'employee') return EmployeeSidebar;
  return Sidebar; // fallback for agent, team_leader, finance, etc.
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'agent';

  const RoleSidebar = getRoleSidebar(userRole);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Role-based Sidebar */}
      <RoleSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header/Navbar */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;