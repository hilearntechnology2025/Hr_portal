// import { useState, useEffect  } from 'react';
// import { Outlet, useNavigate  } from 'react-router-dom';
// import Header from './Header';

// import AdminSidebar from './AdminSidebar';
// import ManagerSidebar from './ManagerSidebar';
// import HrSidebar from './HrSidebar';
// import EmployeeSidebar from './EmployeeSidebar';
// import Sidebar from './Sidebar'; // fallback for agent/team_leader etc.

// const getRoleSidebar = (role) => {
//   if (['admin', 'super_admin'].includes(role)) return AdminSidebar;
//   if (role === 'manager') return ManagerSidebar;
//   if (role === 'hr') return HrSidebar;
//   if (role === 'employee') return EmployeeSidebar;
//   return Sidebar; // fallback for agent, team_leader, finance, etc.
// };

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const userRole = localStorage.getItem('userRole') || 'agent';

//   const RoleSidebar = getRoleSidebar(userRole);

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">

//       {/* Role-based Sidebar */}
//       <RoleSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* Header/Navbar */}
//         <Header onMenuClick={() => setSidebarOpen(true)} />

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto p-4 lg:p-6">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default Layout;


import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useSocket } from '../../hooks/useSocket';
import Toast from '../Common/Toast';

import AdminSidebar from './AdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import HrSidebar from './HrSidebar';
import EmployeeSidebar from './EmployeeSidebar';
import Sidebar from './Sidebar';

const getRoleSidebar = (role) => {
  if (['admin', 'super_admin'].includes(role)) return AdminSidebar;
  if (role === 'manager') return ManagerSidebar;
  if (role === 'hr') return HrSidebar;
  if (role === 'employee') return EmployeeSidebar;
  return Sidebar;
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userRole = localStorage.getItem('userRole') || 'agent';
  const RoleSidebar = getRoleSidebar(userRole);
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  // Listen for new calls
  // useEffect(() => {
  //     if (!socket) return;

  //     const handleNewCall = (callData) => {
  //         console.log('📞 New call received:', callData);

  //         // Show toast notification
  //         setToast({
  //             message: `${callData.customerName} - ${callData.callType} call (${callData.duration})`,
  //             type: 'info'
  //         });

  //         // Trigger dashboard refresh
  //         setRefreshTrigger(prev => prev + 1);

  //         // Auto-hide toast after 5 seconds
  //         setTimeout(() => setToast(null), 5000);
  //     };

  //     socket.on('new-call', handleNewCall);
  //     socket.on('call-saved', (data) => {
  //         console.log('✅ Call saved confirmation:', data);
  //     });

  //     return () => {
  //         socket.off('new-call');
  //         socket.off('call-saved');
  //     };
  // }, [socket]);

  // Listen for new calls
  useEffect(() => {
    if (!socket) return;

    const handleNewCall = (callData) => {
      console.log('📞 New call received:', callData);

      // Show toast notification
      setToast({
        message: `${callData.customerName} - ${callData.callType} call (${callData.duration || '0s'})`,
        type: 'info'
      });

      // Trigger dashboard refresh
      setRefreshTrigger(prev => prev + 1);

      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    };

    const handleCallSaved = (data) => {
      console.log('✅ Call saved confirmation:', data);
      setToast({
        message: 'Call saved successfully!',
        type: 'success'
      });
      setTimeout(() => setToast(null), 3000);
    };

    socket.on('new-call', handleNewCall);
    socket.on('call-saved', handleCallSaved);

    return () => {
      socket.off('new-call');
      socket.off('call-saved');
    };
  }, [socket]);

  // Show connection status (optional)
  useEffect(() => {
    if (isConnected) {
      console.log('🟢 Real-time connection active');
    }
  }, [isConnected]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Connection Status Indicator (optional) */}
      {isConnected && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Live
        </div>
      )}

      {/* Role-based Sidebar */}
      <RoleSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ refreshTrigger }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;