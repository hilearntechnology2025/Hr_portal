import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROLE_COLORS = {
    agent: 'bg-green-100 text-green-700',
    team_leader: 'bg-cyan-100 text-cyan-700',
    manager: 'bg-indigo-100 text-indigo-700',
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-0.5">{value ?? '—'}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

// ── Leave Status Badge ────────────────────────────────────────
const LeaveBadge = ({ status }) => {
    const map = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-600',
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

const HrDashboard = () => {
    const { refreshTrigger } = useOutletContext() || {};
    const [stats, setStats] = useState(null);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const hrName = localStorage.getItem('userName') || 'HR';
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => { fetchData(); }, [refreshTrigger]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, recentRes] = await Promise.all([
                fetch(`${API}/hr/stats`, { headers }),
                fetch(`${API}/hr/recent-employees`, { headers }),
            ]);

            if (!statsRes.ok) throw new Error('Stats load failed');
            const statsData = await statsRes.json();
            const recentData = await recentRes.json();

            setStats(statsData);
            setRecentEmployees(recentData.employees || []);
        } catch (err) {
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500">Loading HR dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            <p className="font-semibold">⚠️ Error</p>
            <p className="text-sm mt-1">{error}</p>
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">HR Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {hrName} 👋</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard label="Total Employees" value={stats?.totalEmployees} icon="👥" color="bg-blue-50" />
                <StatCard label="Active" value={stats?.activeEmployees} icon="✅" color="bg-green-50" />
                <StatCard label="Inactive" value={stats?.inactiveEmployees} icon="🚫" color="bg-red-50" />
                <StatCard label="New This Week" value={stats?.newThisWeek} icon="🆕" color="bg-purple-50" />
            </div>

            {/* Leave Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard label="Pending Leaves" value={stats?.pendingLeaves} icon="⏳" color="bg-yellow-50" subtitle="Action required" />
                <StatCard label="Approved Leaves" value={stats?.approvedLeaves} icon="✔️" color="bg-green-50" subtitle="This cycle" />
                <StatCard label="Rejected Leaves" value={stats?.rejectedLeaves} icon="❌" color="bg-red-50" subtitle="This cycle" />
            </div>

            {/* Role Breakdown + Recent Employees */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Role Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-800 mb-5">Employee Breakdown</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Agents', count: stats?.roleCounts?.agent, color: 'bg-green-500' },
                            { label: 'Team Leaders', count: stats?.roleCounts?.team_leader, color: 'bg-cyan-500' },
                            { label: 'Managers', count: stats?.roleCounts?.manager, color: 'bg-indigo-500' },
                        ].map((item) => {
                            const pct = stats?.totalEmployees
                                ? Math.round((item.count / stats.totalEmployees) * 100)
                                : 0;
                            return (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">{item.label}</span>
                                        <span className="text-gray-500">{item.count ?? 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Employees */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-gray-800">Recent Employees</h2>
                        <button
                            onClick={() => navigate('/hr/employees')}
                            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                            View all →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentEmployees.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No employees found</p>
                        )}
                        {recentEmployees.map((emp) => (
                            <div key={emp._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">
                                    {emp.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[emp.role] || 'bg-gray-100 text-gray-600'}`}>
                                    {emp.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/hr/leaves?status=pending')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-medium hover:bg-yellow-100 transition-colors"
                    >
                        ⏳ Review Pending Leaves
                        {stats?.pendingLeaves > 0 && (
                            <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {stats.pendingLeaves}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/hr/employees')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                        👥 Manage Employees
                    </button>
                    <button
                        onClick={() => navigate('/hr/attendance')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                        📅 Mark Attendance
                    </button>
                    <button
                        onClick={() => navigate('/hr/profile')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        👤 My Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HrDashboard;