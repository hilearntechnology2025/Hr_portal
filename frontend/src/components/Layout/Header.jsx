import { useNavigate, useLocation } from 'react-router-dom';

// Page title map
const pageTitles = {
    '/dashboard': { title: 'Dashboard', subtitle: "Here's your call overview" },
    '/call-logs': { title: 'Call Logs', subtitle: 'View all your call records' },
    '/reports': { title: 'Reports', subtitle: 'Analyze your performance' },
};

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';

    const currentPage = pageTitles[location.pathname] || {
        title: 'Dashboard',
        subtitle: "Here's your call overview",
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">

                {/* Left Side */}
                <div className="flex items-center gap-4">
                    {/* Hamburger - Mobile only */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Page Title */}
                    <div>
                        <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                            {currentPage.title}
                        </h2>
                        <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                            {currentPage.subtitle}
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {/* Notification dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-gray-700 leading-tight">{userName}</p>
                            <p className="text-xs text-gray-500 leading-tight">{userEmail}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                                {userName.charAt(0).toUpperCase()}
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-700 truncate">{userName}</p>
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;

