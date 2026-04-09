// import { useEffect, useState, useCallback } from 'react';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid,
//     Tooltip, ResponsiveContainer, LineChart,
//     Line, PieChart, Pie, Cell,
// } from 'recharts';

// // ─── Dummy Data ───────────────────────────────────────────

// const monthlySummary = [
//     { month: 'Oct', total: 320, connected: 240, missed: 80 },
//     { month: 'Nov', total: 410, connected: 310, missed: 100 },
//     { month: 'Dec', total: 380, connected: 290, missed: 90 },
//     { month: 'Jan', total: 520, connected: 400, missed: 120 },
//     { month: 'Feb', total: 460, connected: 350, missed: 110 },
//     { month: 'Mar', total: 610, connected: 480, missed: 130 },
//     { month: 'Apr', total: 284, connected: 210, missed: 74 },
// ];

// const weeklyTrend = [
//     { week: 'Wk 1', calls: 58, duration: 4.2 },
//     { week: 'Wk 2', calls: 72, duration: 5.1 },
//     { week: 'Wk 3', calls: 65, duration: 3.8 },
//     { week: 'Wk 4', calls: 89, duration: 6.3 },
//     { week: 'Wk 5', calls: 74, duration: 4.9 },
//     { week: 'Wk 6', calls: 95, duration: 7.2 },
//     { week: 'Wk 7', calls: 110, duration: 8.0 },
// ];

// const callTypePie = [
//     { name: 'Incoming', value: 642, color: '#3b82f6' },
//     { name: 'Outgoing', value: 489, color: '#8b5cf6' },
//     { name: 'Missed', value: 153, color: '#f43f5e' },
// ];

// const agentPerformance = [
//     { name: 'Rahul Sharma', calls: 148, connected: 132, missed: 16, duration: '6m 12s', rate: 89 },
//     { name: 'Priya Patel', calls: 134, connected: 118, missed: 16, duration: '5m 44s', rate: 88 },
//     { name: 'Amit Kumar', calls: 119, connected: 98, missed: 21, duration: '4m 30s', rate: 82 },
//     { name: 'Sneha Singh', calls: 105, connected: 95, missed: 10, duration: '7m 05s', rate: 90 },
//     { name: 'Vikram Joshi', calls: 98, connected: 80, missed: 18, duration: '3m 58s', rate: 82 },
//     { name: 'Neha Gupta', calls: 87, connected: 74, missed: 13, duration: '5m 22s', rate: 85 },
// ];

// const summaryCards = [
//     {
//         title: 'Total Calls', value: '2,984', change: '+18.2%', up: true,
//         icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>),
//         bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', bar: 'bg-blue-500',
//     },
//     {
//         title: 'Connected Calls', value: '2,278', change: '+21.4%', up: true,
//         icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
//         bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500',
//     },
//     {
//         title: 'Missed Calls', value: '706', change: '-6.3%', up: false,
//         icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>),
//         bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', bar: 'bg-rose-500',
//     },
//     {
//         title: 'Avg Duration', value: '5m 18s', change: '+0m 42s', up: true,
//         icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
//         bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', bar: 'bg-violet-500',
//     },
// ];

// const TOTAL_PIE = callTypePie.reduce((s, d) => s + d.value, 0);
// const avatarColors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];

// // ─── Custom Tooltips ──────────────────────────────────────

// const BarTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 min-w-[150px]">
//             <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
//             {payload.map((e) => (
//                 <div key={e.name} className="flex items-center justify-between gap-4 mb-1">
//                     <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.fill }}></span>
//                         <span className="text-xs text-gray-500">{e.name}</span>
//                     </div>
//                     <span className="text-xs font-bold text-gray-700">{e.value}</span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const LineTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3 min-w-[130px]">
//             <p className="text-xs font-bold text-gray-600 mb-2">{label}</p>
//             {payload.map((e) => (
//                 <div key={e.name} className="flex justify-between gap-3">
//                     <span className="text-xs text-gray-400">{e.name}</span>
//                     <span className="text-xs font-bold" style={{ color: e.stroke }}>
//                         {e.name === 'Avg Duration' ? `${e.value}m` : e.value}
//                     </span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const PieTooltip = ({ active, payload }) => {
//     if (!active || !payload?.length) return null;
//     const d = payload[0];
//     return (
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3">
//             <div className="flex items-center gap-2 mb-1">
//                 <span className="w-3 h-3 rounded-full" style={{ background: d.payload.color }}></span>
//                 <span className="text-sm font-bold text-gray-700">{d.name}</span>
//             </div>
//             <p className="text-lg font-bold" style={{ color: d.payload.color }}>{d.value}</p>
//             <p className="text-xs text-gray-400">{((d.value / TOTAL_PIE) * 100).toFixed(1)}%</p>
//         </div>
//     );
// };

// // ─── Main Component ───────────────────────────────────────

// const Reports = () => {
//     const [period, setPeriod] = useState('This Month');
//     const [downloading, setDownloading] = useState(false);

//     const periods = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

//     // ── Download helpers INSIDE component so period is accessible ──

//     const triggerDownload = (content, filename, mime) => {
//         const blob = new Blob([content], { type: mime });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     const downloadCSV = () => {
//         const slug = period.replace(/\s+/g, '-').toLowerCase();
//         const headers = ['Agent', 'Total Calls', 'Connected', 'Missed', 'Avg Duration', 'Connect Rate'];
//         const rows = agentPerformance.map((a) => [
//             a.name, a.calls, a.connected, a.missed, a.duration, `${a.rate}%`,
//         ]);
//         const content = [
//             ['Callyzer - Call Report'],
//             [`Period:,${period}`],
//             [`Generated:,${new Date().toLocaleDateString('en-IN')}`],
//             [],
//             headers,
//             ...rows,
//             [],
//             ['SUMMARY'],
//             ['Total Calls', 2984],
//             ['Connected Calls', 2278],
//             ['Missed Calls', 706],
//             ['Avg Duration', '5m 18s'],
//         ].map((r) => r.join(',')).join('\n');

//         triggerDownload(content, `callyzer-report-${slug}.csv`, 'text/csv;charset=utf-8;');
//     };

//     const downloadJSON = () => {
//         const slug = period.replace(/\s+/g, '-').toLowerCase();
//         const data = {
//             generatedAt: new Date().toISOString(),
//             period,
//             summary: { totalCalls: 2984, connectedCalls: 2278, missedCalls: 706, avgDuration: '5m 18s' },
//             agentPerformance,
//             monthlyData: monthlySummary,
//             weeklyTrend,
//             callDistribution: callTypePie,
//         };
//         triggerDownload(JSON.stringify(data, null, 2), `callyzer-report-${slug}.json`, 'application/json');
//     };

//     const handleDownload = (type = 'csv') => {
//         setDownloading(true);
//         setTimeout(() => {
//             type === 'csv' ? downloadCSV() : downloadJSON();
//             setDownloading(false);
//         }, 800);
//     };

//     return (
//         <div className="space-y-6">

//             {/* ── Page Header ── */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
//                     <p className="text-sm text-gray-400 mt-0.5">Call performance summary &amp; analytics</p>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
//                     {/* Period Selector */}
//                     <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
//                         {periods.map((p) => (
//                             <button key={p} onClick={() => setPeriod(p)}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
//                                     ${period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
//                                 {p}
//                             </button>
//                         ))}
//                     </div>
//                     {/* Download Button */}
//                     <button
//                         onClick={() => handleDownload('csv')}
//                         disabled={downloading}
//                         className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-200 disabled:cursor-not-allowed"
//                     >
//                         {downloading ? (
//                             <>
//                                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                                 </svg>
//                                 Preparing...
//                             </>
//                         ) : (
//                             <>
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                                 </svg>
//                                 Download Report
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* ── 4 Summary Cards ── */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                 {summaryCards.map((card, i) => (
//                     <div key={i} className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-shadow duration-200`}>
//                         <div className="flex items-start justify-between mb-4">
//                             <div className={`w-12 h-12 ${card.bg} ${card.text} rounded-xl flex items-center justify-center`}>
//                                 {card.icon}
//                             </div>
//                             <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
//                                 {card.up
//                                     ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
//                                     : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
//                                 }
//                                 {card.change}
//                             </span>
//                         </div>
//                         <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
//                         <p className="text-sm font-medium text-gray-500">{card.title}</p>
//                         <div className="mt-3 pt-3 border-t border-gray-100">
//                             <p className="text-xs text-gray-400">{card.change} vs last period</p>
//                         </div>
//                         <div className={`mt-2 h-1 rounded-full ${card.bar} opacity-20`}></div>
//                         <div className={`-mt-1 h-1 rounded-full ${card.bar} w-3/4`}></div>
//                     </div>
//                 ))}
//             </div>

//             {/* ── Charts Row 1: Monthly Bar + Pie ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//                 {/* Monthly Bar Chart */}
//                 <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//                     <div className="flex items-center justify-between mb-5">
//                         <div>
//                             <h3 className="text-base font-bold text-gray-800">Monthly Call Volume</h3>
//                             <p className="text-xs text-gray-400 mt-0.5">Last 7 months overview</p>
//                         </div>
//                         <div className="flex items-center gap-3 text-xs text-gray-500">
//                             {[{ color: 'bg-blue-500', label: 'Total' }, { color: 'bg-emerald-500', label: 'Connected' }, { color: 'bg-rose-400', label: 'Missed' }].map((l) => (
//                                 <span key={l.label} className="flex items-center gap-1">
//                                     <span className={`w-2.5 h-2.5 rounded-full ${l.color}`}></span>{l.label}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                     <ResponsiveContainer width="100%" height={220}>
//                         <BarChart data={monthlySummary} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3} barCategoryGap="30%">
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                             <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
//                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
//                             <Tooltip content={<BarTooltip />} cursor={{ fill: '#f0f9ff', radius: 6 }} />
//                             <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={22} />
//                             <Bar dataKey="connected" name="Connected" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={22} />
//                             <Bar dataKey="missed" name="Missed" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={22} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Pie Chart */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//                     <div className="mb-4">
//                         <h3 className="text-base font-bold text-gray-800">Call Distribution</h3>
//                         <p className="text-xs text-gray-400 mt-0.5">{TOTAL_PIE.toLocaleString()} total calls</p>
//                     </div>
//                     <ResponsiveContainer width="100%" height={180}>
//                         <PieChart>
//                             <Pie data={callTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
//                                 {callTypePie.map((entry, i) => (
//                                     <Cell key={i} fill={entry.color} stroke="none" />
//                                 ))}
//                             </Pie>
//                             <Tooltip content={<PieTooltip />} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                     <div className="mt-2 space-y-2.5">
//                         {callTypePie.map((d) => (
//                             <div key={d.name}>
//                                 <div className="flex items-center justify-between mb-1">
//                                     <div className="flex items-center gap-2">
//                                         <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
//                                         <span className="text-xs font-medium text-gray-600">{d.name}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-bold text-gray-700">{d.value}</span>
//                                         <span className="text-xs text-gray-400">{((d.value / TOTAL_PIE) * 100).toFixed(1)}%</span>
//                                     </div>
//                                 </div>
//                                 <div className="w-full bg-gray-100 rounded-full h-1.5">
//                                     <div className="h-1.5 rounded-full transition-all duration-500"
//                                         style={{ width: `${(d.value / TOTAL_PIE) * 100}%`, background: d.color }}></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ── Line Chart ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-5">
//                     <div>
//                         <h3 className="text-base font-bold text-gray-800">Weekly Trend</h3>
//                         <p className="text-xs text-gray-400 mt-0.5">Call volume &amp; avg duration over weeks</p>
//                     </div>
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                         <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Total Calls</span>
//                         <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>Avg Duration</span>
//                     </div>
//                 </div>
//                 <ResponsiveContainer width="100%" height={200}>
//                     <LineChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                         <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
//                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
//                         <Tooltip content={<LineTooltip />} />
//                         <Line type="monotone" dataKey="calls" name="Total Calls" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
//                         <Line type="monotone" dataKey="duration" name="Avg Duration" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} strokeDasharray="5 4" />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* ── Agent Performance Table ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div>
//                         <h3 className="text-base font-bold text-gray-800">Agent Performance</h3>
//                         <p className="text-xs text-gray-400 mt-0.5">Individual call stats for {period}</p>
//                     </div>
//                     <button onClick={() => handleDownload('csv')}
//                         className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                         </svg>
//                         Export
//                     </button>
//                 </div>

//                 {/* Desktop Table */}
//                 <div className="hidden md:block overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100">
//                                 {['Agent', 'Total Calls', 'Connected', 'Missed', 'Avg Duration', 'Connect Rate'].map((h) => (
//                                     <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {agentPerformance.map((agent, i) => (
//                                 <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
//                                     <td className="px-5 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-9 h-9 ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
//                                                 {agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
//                                             </div>
//                                             <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{agent.name}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-5 py-4 text-sm font-bold text-gray-700">{agent.calls}</td>
//                                     <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{agent.connected}</td>
//                                     <td className="px-5 py-4 text-sm font-semibold text-rose-500">{agent.missed}</td>
//                                     <td className="px-5 py-4 text-sm text-gray-500">{agent.duration}</td>
//                                     <td className="px-5 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[80px]">
//                                                 <div className={`h-2 rounded-full ${agent.rate >= 88 ? 'bg-emerald-500' : agent.rate >= 83 ? 'bg-blue-500' : 'bg-amber-500'}`}
//                                                     style={{ width: `${agent.rate}%` }}></div>
//                                             </div>
//                                             <span className={`text-xs font-bold w-9 text-right ${agent.rate >= 88 ? 'text-emerald-600' : agent.rate >= 83 ? 'text-blue-600' : 'text-amber-600'}`}>
//                                                 {agent.rate}%
//                                             </span>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="md:hidden divide-y divide-gray-50">
//                     {agentPerformance.map((agent, i) => (
//                         <div key={i} className="p-4">
//                             <div className="flex items-center justify-between mb-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className={`w-9 h-9 ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
//                                         {agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
//                                     </div>
//                                     <span className="text-sm font-semibold text-gray-700">{agent.name}</span>
//                                 </div>
//                                 <span className={`text-sm font-bold ${agent.rate >= 88 ? 'text-emerald-600' : agent.rate >= 83 ? 'text-blue-600' : 'text-amber-600'}`}>
//                                     {agent.rate}%
//                                 </span>
//                             </div>
//                             <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
//                                 <div className={`h-1.5 rounded-full ${agent.rate >= 88 ? 'bg-emerald-500' : agent.rate >= 83 ? 'bg-blue-500' : 'bg-amber-500'}`}
//                                     style={{ width: `${agent.rate}%` }}></div>
//                             </div>
//                             <div className="grid grid-cols-3 gap-2 text-center">
//                                 {[
//                                     { label: 'Total', value: agent.calls, color: 'text-gray-700' },
//                                     { label: 'Connected', value: agent.connected, color: 'text-emerald-600' },
//                                     { label: 'Missed', value: agent.missed, color: 'text-rose-500' },
//                                 ].map((s) => (
//                                     <div key={s.label} className="bg-gray-50 rounded-xl p-2">
//                                         <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
//                                         <p className="text-xs text-gray-400">{s.label}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* ── Download Banner ── */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-white text-center sm:text-left">
//                     <h3 className="text-lg font-bold">Ready to export your report?</h3>
//                     <p className="text-blue-100 text-sm mt-1">Download the full call summary for <span className="font-semibold">{period}</span></p>
//                 </div>
//                 <div className="flex items-center gap-3 flex-shrink-0">
//                     <button onClick={() => handleDownload('csv')}
//                         className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all border border-white/30">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                         CSV
//                     </button>
//                     <button onClick={() => handleDownload('json')} disabled={downloading}
//                         className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-blue-100 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md disabled:cursor-not-allowed">
//                         {downloading ? (
//                             <>
//                                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                                 </svg>
//                                 Preparing...
//                             </>
//                         ) : (
//                             <>
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                                 </svg>
//                                 Download JSON
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Reports;



import { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart,
    Line, PieChart, Pie, Cell,
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Custom Tooltips ──────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 min-w-[150px]">
            <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
            {payload.map((e) => (
                <div key={e.name} className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.fill }}></span>
                        <span className="text-xs text-gray-500">{e.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{e.value}</span>
                </div>
            ))}
        </div>
    );
};

const LineTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3 min-w-[130px]">
            <p className="text-xs font-bold text-gray-600 mb-2">{label}</p>
            {payload.map((e) => (
                <div key={e.name} className="flex justify-between gap-3">
                    <span className="text-xs text-gray-400">{e.name}</span>
                    <span className="text-xs font-bold" style={{ color: e.stroke }}>
                        {e.name === 'Avg Duration' ? `${e.value}m` : e.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ background: d.payload.color }}></span>
                <span className="text-sm font-bold text-gray-700">{d.name}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: d.payload.color }}>{d.value}</p>
            <p className="text-xs text-gray-400">{d.payload.percent || 0}%</p>
        </div>
    );
};

// ─── Helper Components ────────────────────────────────────
const avatarColors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];

const Avatar = ({ name, index }) => {
    const initials = (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className={`w-9 h-9 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {initials}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────
const Reports = () => {
    const [period, setPeriod] = useState('month');
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const periods = ['today', 'yesterday', 'week', 'month', 'quarter'];

    const periodLabels = {
        today: 'Today',
        yesterday: 'Yesterday',
        week: 'This Week',
        month: 'This Month',
        quarter: 'Last 3 Months'
    };

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/reports?range=${period}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load reports');
            setReportData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [period, token]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleDownload = async (format = 'csv') => {
        setDownloading(true);
        try {
            window.open(`${API}/reports/export?format=${format}&range=${period}`, '_blank');
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setTimeout(() => setDownloading(false), 1000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                <p className="font-semibold">⚠️ Error loading reports</p>
                <p className="text-sm mt-1">{error}</p>
                <button onClick={fetchReports} className="mt-3 text-sm text-red-600 hover:underline">
                    Try Again →
                </button>
            </div>
        );
    }

    // Default values to prevent null errors
    const {
        summaryCards = [],
        monthlySummary = [],
        weeklyTrend = [],
        callDistribution = [],
        agentPerformance = []
    } = reportData || {};

    const TOTAL_PIE = callDistribution?.reduce((s, d) => s + d.value, 0) || 1;

    // Add percent to callDistribution for tooltip
    const pieDataWithPercent = callDistribution?.map(d => ({
        ...d,
        percent: ((d.value / TOTAL_PIE) * 100).toFixed(1)
    })) || [];

    return (
        <div className="space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Call performance summary &amp; analytics</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    {/* Period Selector */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                        {periods.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
                                    ${period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                    {/* Download Button */}
                    <button
                        onClick={() => handleDownload('csv')}
                        disabled={downloading}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-200 disabled:cursor-not-allowed"
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Preparing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Report
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── 4 Summary Cards ── */}
            {summaryCards && summaryCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {summaryCards.map((card, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${i === 0 ? 'bg-blue-50 text-blue-600' : i === 1 ? 'bg-emerald-50 text-emerald-600' : i === 2 ? 'bg-rose-50 text-rose-600' : 'bg-violet-50 text-violet-600'} rounded-xl flex items-center justify-center`}>
                                    {i === 0 && (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    )}
                                    {i === 1 && (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {i === 2 && (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                                        </svg>
                                    )}
                                    {i === 3 && (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${card?.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {card?.up ? '↑' : '↓'} {card?.change || '0%'}
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mb-1">{card?.value || 0}</p>
                            <p className="text-sm font-medium text-gray-500">{card?.title || 'N/A'}</p>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400">{card?.change || '0%'} vs last period</p>
                            </div>
                            <div className={`mt-2 h-1 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-rose-500' : 'bg-violet-500'} opacity-20`}></div>
                            <div className={`-mt-1 h-1 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-rose-500' : 'bg-violet-500'} w-3/4`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Charts Row 1: Monthly Bar + Pie ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Monthly Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Monthly Call Volume</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Last 6 months overview</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            {[{ color: 'bg-blue-500', label: 'Total' }, { color: 'bg-emerald-500', label: 'Connected' }, { color: 'bg-rose-400', label: 'Missed' }].map((l) => (
                                <span key={l.label} className="flex items-center gap-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${l.color}`}></span>{l.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    {monthlySummary && monthlySummary.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={monthlySummary} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <Tooltip content={<BarTooltip />} cursor={{ fill: '#f0f9ff', radius: 6 }} />
                                <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={22} />
                                <Bar dataKey="connected" name="Connected" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={22} />
                                <Bar dataKey="missed" name="Missed" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No monthly data available</p>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-gray-800">Call Distribution</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{TOTAL_PIE.toLocaleString()} total calls</p>
                    </div>
                    {pieDataWithPercent.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={pieDataWithPercent} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                        {pieDataWithPercent.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-2 space-y-2.5">
                                {pieDataWithPercent.map((d) => (
                                    <div key={d.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
                                                <span className="text-xs font-medium text-gray-600">{d.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-700">{d.value}</span>
                                                <span className="text-xs text-gray-400">{d.percent}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${d.percent}%`, background: d.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No call distribution data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Line Chart ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Weekly Trend</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Call volume &amp; avg duration over weeks</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Total Calls</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>Avg Duration</span>
                    </div>
                </div>
                {weeklyTrend && weeklyTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip content={<LineTooltip />} />
                            <Line type="monotone" dataKey="calls" name="Total Calls" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="duration" name="Avg Duration" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} strokeDasharray="5 4" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>No weekly trend data available</p>
                    </div>
                )}
            </div>

            {/* ── Agent Performance Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Agent Performance</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Individual call stats for {periodLabels[period]}</p>
                    </div>
                    <button onClick={() => handleDownload('csv')}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                    </button>
                </div>

                {/* Desktop Table */}
                {agentPerformance && agentPerformance.length > 0 ? (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        {['Agent', 'Total Calls', 'Connected', 'Missed', 'Avg Duration', 'Connect Rate'].map((h) => (
                                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {agentPerformance.map((agent, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={agent.name} index={i} />
                                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{agent.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-700">{agent.calls}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{agent.connected}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-rose-500">{agent.missed}</td>
                                            <td className="px-5 py-4 text-sm text-gray-500">{agent.avgDuration}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[80px]">
                                                        <div className={`h-2 rounded-full ${agent.rate >= 88 ? 'bg-emerald-500' : agent.rate >= 83 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${agent.rate}%` }}></div>
                                                    </div>
                                                    <span className={`text-xs font-bold w-9 text-right ${agent.rate >= 88 ? 'text-emerald-600' : agent.rate >= 83 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                        {agent.rate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {agentPerformance.map((agent, i) => (
                                <div key={i} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={agent.name} index={i} />
                                            <span className="text-sm font-semibold text-gray-700">{agent.name}</span>
                                        </div>
                                        <span className={`text-sm font-bold ${agent.rate >= 88 ? 'text-emerald-600' : agent.rate >= 83 ? 'text-blue-600' : 'text-amber-600'}`}>
                                            {agent.rate}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                        <div className={`h-1.5 rounded-full ${agent.rate >= 88 ? 'bg-emerald-500' : agent.rate >= 83 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                            style={{ width: `${agent.rate}%` }}></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        {[
                                            { label: 'Total', value: agent.calls, color: 'text-gray-700' },
                                            { label: 'Connected', value: agent.connected, color: 'text-emerald-600' },
                                            { label: 'Missed', value: agent.missed, color: 'text-rose-500' },
                                        ].map((s) => (
                                            <div key={s.label} className="bg-gray-50 rounded-xl p-2">
                                                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                                                <p className="text-xs text-gray-400">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">👥</p>
                        <p className="text-sm font-medium">No agent performance data available</p>
                        <p className="text-xs mt-1">Try changing the date range</p>
                    </div>
                )}
            </div>

            {/* ── Download Banner ── */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white text-center sm:text-left">
                    <h3 className="text-lg font-bold">Ready to export your report?</h3>
                    <p className="text-blue-100 text-sm mt-1">Download the full call summary for <span className="font-semibold">{periodLabels[period]}</span></p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => handleDownload('csv')}
                        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all border border-white/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button onClick={() => handleDownload('json')} disabled={downloading}
                        className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-blue-100 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md disabled:cursor-not-allowed">
                        {downloading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Preparing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download JSON
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Reports;