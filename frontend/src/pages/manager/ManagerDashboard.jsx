import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const ROLE_COLORS = {
    agent: 'bg-green-100 text-green-700',
    team_leader: 'bg-cyan-100 text-cyan-700',
};

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

const ManagerDashboard = () => {
    const { refreshTrigger } = useOutletContext() || {};
    const [stats, setStats] = useState(null);
    const [recentMembers, setRecentMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName') || 'Manager';
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, recentRes] = await Promise.all([
                fetch(`${API}/manager/stats`, { headers }),
                fetch(`${API}/manager/recent-members`, { headers }),
            ]);

            if (!statsRes.ok) throw new Error('Failed to load stats');
            const statsData = await statsRes.json();
            const recentData = await recentRes.json();

            setStats(statsData);
            setRecentMembers(recentData.members || []);
        } catch (err) {
            setError('There was a problem loading data. Are you a manager?');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Manager dashboard is loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                <p className="font-semibold">⚠️ Access Error</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Hello, {userName} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manager Dashboard — View your team overview
                    </p>
                </div>
                <button
                    onClick={() => navigate('/manager/team')}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
                >
                    + Add Team Member
                </button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    label="Total Team Members"
                    value={stats?.totalTeamMembers}
                    icon="👥"
                    color="bg-indigo-50"
                />
                <StatCard
                    label="Active Members"
                    value={stats?.activeMembers}
                    icon="✅"
                    color="bg-green-50"
                />
                <StatCard
                    label="Inactive Members"
                    value={stats?.inactiveMembers}
                    icon="🚫"
                    color="bg-red-50"
                />
                <StatCard
                    label="New This Week"
                    value={stats?.newMembersThisWeek}
                    icon="🆕"
                    color="bg-purple-50"
                    subtitle="Last 7 days"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    label="Agents"
                    value={stats?.roleCounts?.agent}
                    icon="🎧"
                    color="bg-green-50"
                />
                <StatCard
                    label="Team Leaders"
                    value={stats?.roleCounts?.team_leader}
                    icon="⭐"
                    color="bg-cyan-50"
                />
                <StatCard
                    label="Active Today"
                    value={stats?.todayActive}
                    icon="🟢"
                    color="bg-yellow-50"
                    subtitle="Last 24 hours"
                />
            </div>

            {/* Recent Members + Quick Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Recent Members */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-800">
                            Recently Joined Members
                        </h2>
                        <button
                            onClick={() => navigate('/manager/team')}
                            className="text-indigo-600 text-sm font-medium hover:underline"
                        >
                            View All →
                        </button>
                    </div>

                    {recentMembers.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-4xl mb-2">👥</p>
                            <p>No members yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {member.role === 'team_leader' ? 'Team Leader' : 'Agent'}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${member.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-5">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            {
                                icon: '➕',
                                label: 'Add New Agent',
                                desc: 'Create a new agent in the team',
                                path: '/manager/team',
                                color: 'bg-green-50 hover:bg-green-100 border-green-200',
                            },
                            {
                                icon: '⭐',
                                label: 'Promote to Team Leader',
                                desc: 'Promote an agent to team leader',
                                path: '/manager/team',
                                color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
                            },
                            {
                                icon: '👁️',
                                label: 'View Full Team',
                                desc: 'See list of all members',
                                path: '/manager/team',
                                color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
                            },
                            {
                                icon: '👤',
                                label: 'Update Profile',
                                desc: 'Update your personal info',
                                path: '/manager/profile',
                                color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
                            },
                        ].map((action) => (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${action.color}`}
                            >
                                <span className="text-2xl">{action.icon}</span>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {action.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;