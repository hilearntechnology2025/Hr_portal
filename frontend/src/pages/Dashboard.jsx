import { useState, useEffect, useCallback } from 'react';
import CallCharts from '../components/Charts/CallCharts';
import { useOutletContext } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helper Components ────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        Connected: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        Missed: 'bg-rose-50 text-rose-700 border border-rose-200',
        Rejected: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
            {status}
        </span>
    );
};

const TypeBadge = ({ type }) => {
    const styles = {
        Incoming: 'bg-blue-50 text-blue-700 border border-blue-200',
        Outgoing: 'bg-violet-50 text-violet-700 border border-violet-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[type] || ''}`}>
            {type}
        </span>
    );
};

const SummaryCard = ({ title, value, change, up, icon, bg, textColor }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${bg} ${textColor} rounded-xl flex items-center justify-center`}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {up ? '↑' : '↓'} {change}
            </div>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{change} vs last month</p>
        </div>
    </div>
);

// ─── Main Dashboard Component ─────────────────────────────
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const userName = localStorage.getItem('userName') || 'User';

    const { refreshTrigger } = useOutletContext() || {};
    const { socket } = useSocket();

    // Add with other states
    const [progress, setProgress] = useState({ daily: { target: 0, achieved: 0, percentage: 0 }, monthly: { target: 0, achieved: 0, percentage: 0 } });

    // Add this useEffect
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(`${API}/targets/my-progress`, { headers });
                const data = await res.json();
                setProgress(data);
            } catch (err) {
                console.error("Failed to fetch progress:", err);
            }
        };
        fetchProgress();
    }, [refreshTrigger]);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load dashboard');
            setDashboardData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard, refreshTrigger]);
    useEffect(() => {
        if (!socket) return;

        // Naya call aaya to dashboard refresh ho
        socket.on('new-call', () => {
            fetchDashboard();
        });

        return () => socket.off('new-call');
    }, [socket, fetchDashboard]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                <p className="font-semibold">⚠️ Error loading dashboard</p>
                <p className="text-sm mt-1">{error}</p>
                <button onClick={fetchDashboard} className="mt-3 text-sm text-red-600 hover:underline">
                    Try Again →
                </button>
            </div>
        );
    }

    const { summary, weeklyTrend, recentCalls, topAgents, user } = dashboardData || {};

    // Prepare summary cards data
    const summaryCards = summary ? [
        {
            title: 'Total Calls',
            value: summary.totalCalls?.toLocaleString() || '0',
            change: summary.connectRate ? `+${summary.connectRate}%` : '0%',
            up: true,
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>),
            bg: 'bg-blue-50', textColor: 'text-blue-600',
        },
        {
            title: 'Incoming Calls',
            value: summary.incomingCalls?.toLocaleString() || '0',
            change: '+8.2%',
            up: true,
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>),
            bg: 'bg-emerald-50', textColor: 'text-emerald-600',
        },
        {
            title: 'Outgoing Calls',
            value: summary.outgoingCalls?.toLocaleString() || '0',
            change: '+3.1%',
            up: true,
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>),
            bg: 'bg-violet-50', textColor: 'text-violet-600',
        },
        {
            title: 'Missed Calls',
            value: summary.missedCalls?.toLocaleString() || '0',
            change: '-4.6%',
            up: false,
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>),
            bg: 'bg-rose-50', textColor: 'text-rose-600',
        },
    ] : [];

    const maxTotal = weeklyTrend ? Math.max(...weeklyTrend.map(d => d.total), 1) : 1;

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Welcome back, <span className="font-semibold text-blue-600">{userName}</span> — here's today's overview
                    </p>
                </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <SummaryCard key={i} {...card} />
                ))}
            </div>

            {/* Middle Row: Chart + Top Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Weekly Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Weekly Call Activity</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Last 7 days breakdown</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Incoming</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Outgoing</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Missed</span>
                        </div>
                    </div>

                    {weeklyTrend && weeklyTrend.length > 0 ? (
                        <div className="flex items-end justify-between gap-2 h-36">
                            {weeklyTrend.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex flex-col gap-0.5 items-center justify-end" style={{ height: '120px' }}>
                                        <div className="w-full flex flex-col rounded-t-lg overflow-hidden gap-px" style={{ height: `${(d.total / maxTotal) * 110}px` }}>
                                            <div className="bg-rose-400" style={{ height: `${(d.missed / d.total) * 100}%` }}></div>
                                            <div className="bg-violet-500" style={{ height: `${(d.outgoing / d.total) * 100}%` }}></div>
                                            <div className="bg-blue-500 flex-1"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No call data for this week</p>
                        </div>
                    )}
                </div>

                {/* Top Agents */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-gray-800">Top Agents</h3>
                        <p className="text-xs text-gray-400 mt-0.5">By connected calls</p>
                    </div>
                    <div className="space-y-4">
                        {topAgents && topAgents.length > 0 ? (
                            topAgents.map((agent, i) => {
                                const rate = agent.calls > 0 ? Math.round((agent.connected / agent.calls) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                                {agent.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-700 truncate">{agent.name}</p>
                                                    <span className="text-xs font-bold text-gray-500 ml-2">{rate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 ml-11">
                                            <div className={`${agent.color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${rate}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-400 py-6">No agent data available</p>
                        )}
                    </div>

                    {/* Quick Stats */}
                    {summary && (
                        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold text-blue-600">{summary.connectRate || 0}%</p>
                                <p className="text-xs text-gray-500">Connect Rate</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold text-emerald-600">{summary.avgDuration || '0s'}</p>
                                <p className="text-xs text-gray-500">Avg Duration</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Progress */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Today's Target</p>
                            <p className="text-2xl font-bold text-gray-800">{progress.daily.achieved} / {progress.daily.target}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🎯</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress.daily.percentage, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{progress.daily.percentage}% completed</p>
                </div>

                {/* Monthly Progress */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Monthly Target</p>
                            <p className="text-2xl font-bold text-gray-800">{progress.monthly.achieved} / {progress.monthly.target}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">📊</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress.monthly.percentage, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{progress.monthly.percentage}% completed</p>
                </div>
            </div>

            {/* Charts Section */}
            <CallCharts />

            {/* Recent Calls Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Recent Calls</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Latest call activity</p>
                    </div>
                    <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Caller', 'Number', 'Type', 'Duration', 'Status', 'Time'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentCalls && recentCalls.length > 0 ? (
                                recentCalls.map((call, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-150">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {call.avatar || 'U'}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{call.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">{call.number}</td>
                                        <td className="px-5 py-3.5"><TypeBadge type={call.type} /></td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500 font-medium">{call.duration}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={call.status} /></td>
                                        <td className="px-5 py-3.5 text-sm text-gray-400">{call.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        No recent calls found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;