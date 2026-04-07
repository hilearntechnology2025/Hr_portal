import { useState } from 'react';
import CallCharts from '../components/Charts/CallCharts';

// ─── Dummy Data ───────────────────────────────────────────
const summaryCards = [
    {
        title: 'Total Calls',
        value: '1,284',
        change: '+12.5%',
        changeType: 'up',
        subtitle: 'vs last month',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        bg: 'bg-blue-600',
        lightBg: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-100',
    },
    {
        title: 'Incoming Calls',
        value: '642',
        change: '+8.2%',
        changeType: 'up',
        subtitle: 'vs last month',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
        ),
        bg: 'bg-emerald-500',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
    },
    {
        title: 'Outgoing Calls',
        value: '489',
        change: '+3.1%',
        changeType: 'up',
        subtitle: 'vs last month',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
        bg: 'bg-violet-500',
        lightBg: 'bg-violet-50',
        textColor: 'text-violet-600',
        borderColor: 'border-violet-100',
    },
    {
        title: 'Missed Calls',
        value: '153',
        change: '-4.6%',
        changeType: 'down',
        subtitle: 'vs last month',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
        ),
        bg: 'bg-rose-500',
        lightBg: 'bg-rose-50',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-100',
    },
];

const recentCalls = [
    { name: 'Rahul Sharma', number: '+91 98765 43210', type: 'Incoming', duration: '5m 20s', status: 'Connected', time: '10:30 AM', avatar: 'RS' },
    { name: 'Priya Patel', number: '+91 87654 32109', type: 'Outgoing', duration: '2m 10s', status: 'Connected', time: '11:15 AM', avatar: 'PP' },
    { name: 'Amit Kumar', number: '+91 76543 21098', type: 'Incoming', duration: '0s', status: 'Missed', time: '12:00 PM', avatar: 'AK' },
    { name: 'Sneha Singh', number: '+91 65432 10987', type: 'Outgoing', duration: '8m 45s', status: 'Connected', time: '01:30 PM', avatar: 'SS' },
    { name: 'Vikram Joshi', number: '+91 54321 09876', type: 'Incoming', duration: '0s', status: 'Rejected', time: '02:45 PM', avatar: 'VJ' },
    { name: 'Neha Gupta', number: '+91 43210 98765', type: 'Outgoing', duration: '3m 05s', status: 'Connected', time: '03:20 PM', avatar: 'NG' },
];

const weeklyData = [
    { day: 'Mon', total: 58, incoming: 32, outgoing: 20, missed: 6 },
    { day: 'Tue', total: 72, incoming: 40, outgoing: 25, missed: 7 },
    { day: 'Wed', total: 65, incoming: 35, outgoing: 22, missed: 8 },
    { day: 'Thu', total: 80, incoming: 45, outgoing: 28, missed: 7 },
    { day: 'Fri', total: 49, incoming: 27, outgoing: 18, missed: 4 },
    { day: 'Sat', total: 30, incoming: 18, outgoing: 10, missed: 2 },
    { day: 'Sun', total: 20, incoming: 12, outgoing: 6, missed: 2 },
];

const topAgents = [
    { name: 'Rahul Sharma', calls: 148, connected: 132, avatar: 'RS', color: 'bg-blue-500' },
    { name: 'Priya Patel', calls: 134, connected: 118, avatar: 'PP', color: 'bg-emerald-500' },
    { name: 'Amit Kumar', calls: 119, connected: 98, avatar: 'AK', color: 'bg-violet-500' },
    { name: 'Sneha Singh', calls: 105, connected: 95, avatar: 'SS', color: 'bg-rose-500' },
];

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

// ─── Main Dashboard Component ─────────────────────────────
const Dashboard = () => {
    const [activeFilter, setActiveFilter] = useState('Today');
    const filters = ['Today', 'This Week', 'This Month'];
    const maxTotal = Math.max(...weeklyData.map((d) => d.total));

    return (
        <div className="space-y-6">

            {/* ── Top Bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Welcome back, <span className="font-semibold text-blue-600">
                            {localStorage.getItem('userName') || 'User'}
                        </span> — here's today's overview
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeFilter === f
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── 4 Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <div
                        key={i}
                        className={`bg-white rounded-2xl p-5 border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                        {/* Top Row */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${card.lightBg} ${card.textColor} rounded-xl flex items-center justify-center`}>
                                {card.icon}
                            </div>
                            {/* Change Badge */}
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                                ${card.changeType === 'up'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-rose-50 text-rose-600'
                                }`}>
                                {card.changeType === 'up' ? (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                {card.change}
                            </div>
                        </div>

                        {/* Value */}
                        <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
                        <p className="text-sm font-medium text-gray-600">{card.title}</p>

                        {/* Bottom */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">{card.change} {card.subtitle}</p>
                        </div>

                        {/* Color Bar at bottom */}
                        <div className={`mt-3 h-1 rounded-full ${card.bg} opacity-30`}></div>
                        <div className={`-mt-1 h-1 rounded-full ${card.bg} w-2/3`}></div>
                    </div>
                ))}
            </div>

            {/* ── Middle Row: Chart + Top Agents ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Weekly Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Weekly Call Activity</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Last 7 days breakdown</p>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Incoming
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block"></span> Outgoing
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Missed
                            </span>
                        </div>
                    </div>

                    {/* Bars */}
                    <div className="flex items-end justify-between gap-2 h-36">
                        {weeklyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col gap-0.5 items-center justify-end"
                                    style={{ height: '120px' }}>
                                    {/* Stacked bars */}
                                    <div className="w-full flex flex-col rounded-t-lg overflow-hidden gap-px"
                                        style={{ height: `${(d.total / maxTotal) * 110}px` }}>
                                        <div className="bg-rose-400"
                                            style={{ height: `${(d.missed / d.total) * 100}%` }}></div>
                                        <div className="bg-violet-500"
                                            style={{ height: `${(d.outgoing / d.total) * 100}%` }}></div>
                                        <div className="bg-blue-500 flex-1"></div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Agents */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-gray-800">Top Agents</h3>
                        <p className="text-xs text-gray-400 mt-0.5">By connected calls</p>
                    </div>
                    <div className="space-y-4">
                        {topAgents.map((agent, i) => {
                            const rate = Math.round((agent.connected / agent.calls) * 100);
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
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 ml-11">
                                        <div
                                            className={`${agent.color} h-1.5 rounded-full transition-all duration-500`}
                                            style={{ width: `${rate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-blue-600">76%</p>
                            <p className="text-xs text-gray-500">Connect Rate</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-emerald-600">4m 32s</p>
                            <p className="text-xs text-gray-500">Avg Duration</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Charts Section ── */}
            <CallCharts />

            {/* ── Recent Calls Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Table Header */}
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

                {/* Table */}
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
                            {recentCalls.map((call, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-150"
                                >
                                    {/* Caller */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {call.avatar}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Showing 6 of 1,284 calls</p>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
