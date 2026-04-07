import { NavLink, useNavigate } from 'react-router-dom';

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', color: '#8B5CF6' },
  admin: { label: 'Admin', color: '#3B82F6' },
  manager: { label: 'Manager', color: '#6366F1' },
  team_leader: { label: 'Team Leader', color: '#0EA5E9' },
  agent: { label: 'Agent', color: '#10B981' },
  hr: { label: 'HR', color: '#F59E0B' },
  finance: { label: 'Finance', color: '#F97316' },
  employee: { label: 'Employee', color: '#14B8A6' },
};

const EMPLOYEE_MENU = [
  {
    path: '/my-leaves', label: 'My Leaves',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
];

const MAIN_MENU = [
  {
    path: '/dashboard', label: 'Dashboard',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    path: '/call-logs', label: 'Call Logs',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  },
  {
    path: '/reports', label: 'Reports',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    path: '/attendance', label: 'My Attendance',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  // My Leaves item removed from here as requested
];

const HR_MENU = [
  {
    path: '/hr', label: 'HR Overview',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  {
    path: '/hr/employees', label: 'Employees',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    path: '/hr/leaves', label: 'Leave Management',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    path: '/hr/attendance', label: 'Attendance',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    path: '/hr/profile', label: 'My Profile',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
];

const MANAGER_MENU = [
  {
    path: '/manager', label: 'Manager Overview',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  {
    path: '/manager/team', label: 'My Team',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    path: '/manager/profile', label: 'My Profile',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
];

const ADMIN_MENU = [
  {
    path: '/admin', label: 'Admin Overview',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  {
    path: '/admin/users', label: 'Manage Users',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    path: '/admin/settings', label: 'Settings',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const NavItem = ({ path, label, icon, onClose, exact }) => (
  <NavLink
    to={path}
    end={exact}
    onClick={onClose}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium group
      ${isActive
        ? 'bg-white text-blue-600 shadow-md'
        : 'text-blue-100 hover:bg-blue-500/60 hover:text-white'
      }
    `}
  >
    {({ isActive }) => (
      <>
        <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-blue-200 group-hover:text-white'}`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </>
    )}
  </NavLink>
);

const SectionDivider = ({ label }) => (
  <div className="pt-4 pb-2">
    <div className="flex items-center gap-2 px-4">
      <div className="flex-1 h-px bg-blue-500/40" />
      <p className="text-blue-300/70 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex-1 h-px bg-blue-500/40" />
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'agent';
  const userName = localStorage.getItem('userName') || 'User';

  const isAdmin = ['admin', 'super_admin'].includes(userRole);
  const isManager = userRole === 'manager';
  const isHr = userRole === 'hr';
  const isEmployee = userRole === 'employee'; // Added employee check

  const roleInfo = ROLE_CONFIG[userRole] || { label: userRole, color: '#64748b' };

  const handleLogout = () => {
    ['token', 'userName', 'userEmail', 'userId', 'userRole'].forEach(k =>
      localStorage.removeItem(k)
    );
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-white z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64
        bg-gradient-to-b from-blue-600 to-blue-700
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-2xl
      `}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-blue-500/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-lg">📞</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-extrabold leading-none">Callyzer</h1>
              <p className="text-blue-200 text-xs mt-0.5">Call Analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-blue-200 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
          <p className="text-blue-300/70 text-xs font-bold uppercase tracking-widest px-4 mb-2">Main Menu</p>
          {MAIN_MENU.map(item => (
            <NavItem key={item.path} {...item} onClose={onClose} exact={item.path === '/dashboard'} />
          ))}

          {/* Employee Panel Section - Added after Main Menu, before Manager Panel */}
          {isEmployee && (
            <>
              <SectionDivider label="Employee Panel" />
              {EMPLOYEE_MENU.map(item => (
                <NavItem key={item.path} {...item} onClose={onClose} />
              ))}
            </>
          )}

          {isManager && (
            <>
              <SectionDivider label="Manager Panel" />
              {MANAGER_MENU.map(item => (
                <NavItem key={item.path} {...item} onClose={onClose} exact={item.path === '/manager'} />
              ))}
            </>
          )}

          {isHr && (
            <>
              <SectionDivider label="HR Panel" />
              {HR_MENU.map(item => (
                <NavItem key={item.path} {...item} onClose={onClose} exact={item.path === '/hr'} />
              ))}
            </>
          )}

          {isAdmin && (
            <>
              <SectionDivider label="Admin Panel" />
              {ADMIN_MENU.map(item => (
                <NavItem key={item.path} {...item} onClose={onClose} exact={item.path === '/admin'} />
              ))}
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-blue-500/50">
          <div className="flex items-center gap-3 px-3 py-3 bg-blue-500/30 rounded-xl mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}99)` }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate leading-tight">{userName}</p>
              <p className="text-xs truncate" style={{ color: roleInfo.color === '#64748b' ? '#bfdbfe' : roleInfo.color }}>
                {roleInfo.label}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-100 hover:bg-red-500/80 hover:text-white transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-blue-200 group-hover:text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;