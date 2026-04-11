// import { useState, useEffect } from 'react';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const ManagerTargets = () => {
//     const [teamProgress, setTeamProgress] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedAgent, setSelectedAgent] = useState(null);
//     const [targetValue, setTargetValue] = useState('');
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };

//     useEffect(() => {
//         fetchTeamProgress();
//     }, []);

//     const fetchTeamProgress = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API}/targets/team-progress`, { headers });
//             const data = await res.json();
//             setTeamProgress(data.teamProgress || []);
//         } catch (err) {
//             console.error("Failed to fetch team progress:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const setTarget = async (agentId) => {
//         if (!targetValue) return;
//         const now = new Date();
//         try {
//             const res = await fetch(`${API}/targets/manager`, {
//                 method: 'POST',
//                 headers: { ...headers, 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     agentId,
//                     period: 'monthly',
//                     targetCalls: parseInt(targetValue),
//                     year: now.getFullYear(),
//                     month: now.getMonth() + 1
//                 })
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 alert('Target set successfully!');
//                 setSelectedAgent(null);
//                 setTargetValue('');
//                 fetchTeamProgress();
//             } else {
//                 alert(data.message);
//             }
//         } catch (err) {
//             alert('Failed to set target');
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Team Targets</h1>
//                 <p className="text-gray-500 text-sm mt-1">Set monthly call targets for your team members</p>
//             </div>

//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 {loading ? (
//                     <div className="flex justify-center py-20">
//                         <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//                     </div>
//                 ) : teamProgress.length === 0 ? (
//                     <div className="text-center py-20 text-gray-400">
//                         <p className="text-4xl mb-3">👥</p>
//                         <p>No team members found</p>
//                     </div>
//                 ) : (
//                     <table className="w-full">
//                         <thead className="bg-gray-50">
//                             <tr className="border-b">
//                                 <th className="px-5 py-3 text-left">Agent</th>
//                                 <th className="px-5 py-3 text-left">Target</th>
//                                 <th className="px-5 py-3 text-left">Achieved</th>
//                                 <th className="px-5 py-3 text-left">Progress</th>
//                                 <th className="px-5 py-3 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y">
//                             {teamProgress.map((member) => (
//                                 <tr key={member.agentId} className="hover:bg-gray-50">
//                                     <td className="px-5 py-4">
//                                         <div className="font-semibold">{member.name}</div>
//                                         <div className="text-xs text-gray-500">{member.role}</div>
//                                     </td>
//                                     <td className="px-5 py-4 font-bold">{member.target || 'Not set'}</td>
//                                     <td className="px-5 py-4 text-green-600 font-semibold">{member.achieved}</td>
//                                     <td className="px-5 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="flex-1 bg-gray-100 rounded-full h-2">
//                                                 <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${member.percentage}%` }}></div>
//                                             </div>
//                                             <span className="text-xs font-medium">{member.percentage}%</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-5 py-4">
//                                         {selectedAgent === member.agentId ? (
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="number"
//                                                     value={targetValue}
//                                                     onChange={e => setTargetValue(e.target.value)}
//                                                     placeholder="Target"
//                                                     className="w-24 border rounded-lg px-2 py-1 text-sm"
//                                                 />
//                                                 <button onClick={() => setTarget(member.agentId)} className="text-green-600">Save</button>
//                                                 <button onClick={() => setSelectedAgent(null)} className="text-red-500">Cancel</button>
//                                             </div>
//                                         ) : (
//                                             <button onClick={() => setSelectedAgent(member.agentId)} className="text-indigo-600 hover:underline text-sm">
//                                                 Set Target
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ManagerTargets;

// import { useState, useEffect } from 'react';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const ManagerTargets = () => {
//     const [teamProgress, setTeamProgress] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedAgent, setSelectedAgent] = useState(null);
//     const [targetValue, setTargetValue] = useState('');
//     const [period, setPeriod] = useState('monthly'); // daily, weekly, monthly
//     const [toast, setToast] = useState(null);

//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };

//     useEffect(() => {
//         fetchTeamProgress();
//     }, []);

//     const showToast = (msg, type = 'success') => {
//         setToast({ msg, type });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const fetchTeamProgress = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API}/targets/team-progress`, { headers });
//             const data = await res.json();
//             setTeamProgress(data.teamProgress || []);
//         } catch (err) {
//             console.error("Failed to fetch team progress:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const setTarget = async (agentId) => {
//         if (!targetValue || targetValue <= 0) {
//             showToast('Please enter a valid target number', 'error');
//             return;
//         }

//         const now = new Date();
//         const year = now.getFullYear();
//         const month = now.getMonth() + 1;
//         const day = now.getDate();

//         try {
//             const res = await fetch(`${API}/targets/manager`, {
//                 method: 'POST',
//                 headers: { ...headers, 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     agentId,
//                     period: period,
//                     targetCalls: parseInt(targetValue),
//                     year: year,
//                     month: month,
//                     day: period === 'daily' ? day : undefined
//                 })
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 showToast(`✅ ${period.charAt(0).toUpperCase() + period.slice(1)} target set successfully!`);
//                 setSelectedAgent(null);
//                 setTargetValue('');
//                 setPeriod('monthly');
//                 fetchTeamProgress();
//             } else {
//                 showToast(data.message || 'Failed to set target', 'error');
//             }
//         } catch (err) {
//             showToast('Failed to set target', 'error');
//         }
//     };

//     const getPeriodLabel = (periodType) => {
//         switch (periodType) {
//             case 'daily': return 'Daily';
//             case 'weekly': return 'Weekly';
//             case 'monthly': return 'Monthly';
//             default: return 'Monthly';
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Toast Notification */}
//             {toast && (
//                 <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
//                     }`}>
//                     {toast.msg}
//                 </div>
//             )}

//             {/* Header */}
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Team Targets</h1>
//                 <p className="text-gray-500 text-sm mt-1">Set daily, weekly or monthly call targets for your team members</p>
//             </div>

//             {/* Period Filter Tabs */}
//             <div className="flex gap-2">
//                 {['daily', 'weekly', 'monthly'].map(p => (
//                     <button
//                         key={p}
//                         onClick={() => setPeriod(p)}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
//                             ? 'bg-indigo-600 text-white'
//                             : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//                             }`}
//                     >
//                         {p.charAt(0).toUpperCase() + p.slice(1)}
//                     </button>
//                 ))}
//             </div>
//             {/* Team Progress Table */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 {loading ? (
//                     <div className="flex justify-center py-20">
//                         <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//                     </div>
//                 ) : teamProgress.length === 0 ? (
//                     <div className="text-center py-20 text-gray-400">
//                         <p className="text-4xl mb-3">👥</p>
//                         <p>No team members found</p>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50">
//                                 <tr className="border-b">
//                                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Agent</th>
//                                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Target</th>
//                                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Achieved</th>
//                                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Progress</th>
//                                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y">
//                                 {teamProgress.map((member) => (
//                                     <tr key={member.agentId} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-5 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
//                                                     {member.name?.charAt(0).toUpperCase()}
//                                                 </div>
//                                                 <div>
//                                                     <div className="font-semibold text-gray-800">{member.name}</div>
//                                                     <div className="text-xs text-gray-500 capitalize">{member.role?.replace('_', ' ')}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         {/* <td className="px-5 py-4">
//                                             {member.target > 0 ? (
//                                                 <span className="font-bold text-gray-800">{member.target}</span>
//                                             ) : (
//                                                 <span className="text-gray-400">Not set</span>
//                                             )}
//                                         </td> */}
//                                         <td className="px-5 py-4">
//                                             {member[period]?.target > 0 ? (
//                                                 <span className="font-bold text-gray-800">{member[period].target}</span>
//                                             ) : (
//                                                 <span className="text-gray-400">Not set</span>
//                                             )}
//                                         </td>
//                                         {/* <td className="px-5 py-4">
//                                             <span className="font-semibold text-green-600">{member.achieved}</span>
//                                         </td> */}
//                                         <td className="px-5 py-4">
//                                             <span className="font-semibold text-green-600">{member[period]?.achieved || 0}</span>
//                                         </td>
//                                         {/* <td className="px-5 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="flex-1 bg-gray-100 rounded-full h-2">
//                                                     <div
//                                                         className={`h-2 rounded-full transition-all duration-500 ${member.percentage >= 80 ? 'bg-green-500' :
//                                                             member.percentage >= 50 ? 'bg-yellow-500' : 'bg-indigo-500'
//                                                             }`}
//                                                         style={{ width: `${Math.min(member.percentage, 100)}%` }}
//                                                     />
//                                                 </div>
//                                                 <span className={`text-xs font-medium ${member.percentage >= 80 ? 'text-green-600' :
//                                                     member.percentage >= 50 ? 'text-yellow-600' : 'text-indigo-600'
//                                                     }`}>
//                                                     {member.percentage}%
//                                                 </span>
//                                             </div>
//                                         </td> */}
//                                         <td className="px-5 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="flex-1 bg-gray-100 rounded-full h-2">
//                                                     <div
//                                                         className={`h-2 rounded-full transition-all duration-500 ${member[period]?.percentage >= 80 ? 'bg-green-500' :
//                                                                 member[period]?.percentage >= 50 ? 'bg-yellow-500' : 'bg-indigo-500'
//                                                             }`}
//                                                         style={{ width: `${Math.min(member[period]?.percentage || 0, 100)}%` }}
//                                                     />
//                                                 </div>
//                                                 <span className={`text-xs font-medium ${member[period]?.percentage >= 80 ? 'text-green-600' :
//                                                         member[period]?.percentage >= 50 ? 'text-yellow-600' : 'text-indigo-600'
//                                                     }`}>
//                                                     {member[period]?.percentage || 0}%
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-5 py-4">
//                                             {selectedAgent === member.agentId ? (
//                                                 <div className="space-y-3">
//                                                     {/* Period Selection */}
//                                                     <div className="flex gap-2">
//                                                         {['daily', 'weekly', 'monthly'].map(p => (
//                                                             <button
//                                                                 key={p}
//                                                                 onClick={() => setPeriod(p)}
//                                                                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p
//                                                                     ? 'bg-indigo-600 text-white'
//                                                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                                     }`}
//                                                             >
//                                                                 {p.charAt(0).toUpperCase() + p.slice(1)}
//                                                             </button>
//                                                         ))}
//                                                     </div>
//                                                     {/* Target Input */}
//                                                     <div className="flex items-center gap-2">
//                                                         <input
//                                                             type="number"
//                                                             value={targetValue}
//                                                             onChange={e => setTargetValue(e.target.value)}
//                                                             placeholder="Target calls"
//                                                             className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                                                             min="1"
//                                                         />
//                                                         <button
//                                                             onClick={() => setTarget(member.agentId)}
//                                                             className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
//                                                         >
//                                                             Save
//                                                         </button>
//                                                         <button
//                                                             onClick={() => {
//                                                                 setSelectedAgent(null);
//                                                                 setTargetValue('');
//                                                                 setPeriod('monthly');
//                                                             }}
//                                                             className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
//                                                         >
//                                                             Cancel
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <button
//                                                     onClick={() => setSelectedAgent(member.agentId)}
//                                                     className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
//                                                 >
//                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                                     </svg>
//                                                     Set Target
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Info Card */}
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
//                 <div className="flex items-start gap-4">
//                     <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                     </div>
//                     <div>
//                         <h4 className="font-semibold text-gray-800 mb-1">About Targets</h4>
//                         <ul className="text-sm text-gray-600 space-y-1">
//                             <li>• <strong>Daily Target:</strong> Resets every day, progress based on today's calls</li>
//                             <li>• <strong>Weekly Target:</strong> Resets every week (Monday-Sunday)</li>
//                             <li>• <strong>Monthly Target:</strong> Resets every month, progress based on current month</li>
//                             <li>• Agents can see their progress on their dashboard</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ManagerTargets;

import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Modal Component ───────────────────────────────────────
const SetTargetModal = ({ agent, onClose, onSave, loading }) => {
    const [period, setPeriod] = useState('monthly');
    const [targetValue, setTargetValue] = useState('');

    const periodConfig = {
        daily:   { icon: '☀️', label: 'Daily',   desc: 'Resets every day',        color: 'from-orange-400 to-amber-500',   ring: 'ring-orange-400',  bg: 'bg-orange-50',   text: 'text-orange-600'  },
        weekly:  { icon: '📅', label: 'Weekly',  desc: 'Resets every Monday',     color: 'from-blue-400 to-indigo-500',    ring: 'ring-blue-400',    bg: 'bg-blue-50',     text: 'text-blue-600'    },
        monthly: { icon: '📊', label: 'Monthly', desc: 'Resets every 1st',        color: 'from-violet-400 to-purple-600',  ring: 'ring-violet-400',  bg: 'bg-violet-50',   text: 'text-violet-600'  },
    };

    const selected = periodConfig[period];

    const handleSave = () => {
        if (!targetValue || parseInt(targetValue) <= 0) return;
        onSave({ period, targetCalls: parseInt(targetValue) });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    style={{ animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
                >
                    {/* Modal Header — gradient */}
                    <div className={`bg-gradient-to-br ${selected.color} p-6 relative overflow-hidden`}>
                        {/* Decorative circles */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                                    🎯
                                </div>
                                <div>
                                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Set Target</p>
                                    <p className="text-white font-bold text-xl">{agent?.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="relative mt-4">
                            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                {agent?.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5">

                        {/* Period Selection */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select Period</p>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(periodConfig).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        onClick={() => setPeriod(key)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                                            period === key
                                                ? `${cfg.bg} border-transparent ring-2 ${cfg.ring} shadow-sm`
                                                : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xl">{cfg.icon}</span>
                                        <span className={`text-xs font-bold ${period === key ? cfg.text : 'text-gray-500'}`}>
                                            {cfg.label}
                                        </span>
                                        <span className="text-[10px] text-gray-400 text-center leading-tight">{cfg.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Target Input */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                {selected.label} Call Target
                            </p>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={targetValue}
                                    onChange={e => setTargetValue(e.target.value)}
                                    placeholder="e.g. 50"
                                    min="1"
                                    className={`w-full border-2 rounded-2xl px-4 py-3.5 text-2xl font-bold text-gray-800 placeholder-gray-200 outline-none transition-all focus:ring-4 ${selected.ring}/20 focus:border-transparent`}
                                    style={{ borderColor: targetValue ? '' : '#e5e7eb' }}
                                    onFocus={e => e.target.style.borderColor = ''}
                                    autoFocus
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                                    calls
                                </span>
                            </div>
                        </div>

                        {/* Quick Presets */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Quick Presets</p>
                            <div className="flex gap-2 flex-wrap">
                                {(period === 'daily' ? [10, 20, 30, 50] : period === 'weekly' ? [50, 100, 150, 200] : [100, 200, 300, 500]).map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setTargetValue(String(v))}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                                            targetValue === String(v)
                                                ? `${selected.bg} ${selected.text} shadow-sm`
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 pb-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border-2 border-gray-100 text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!targetValue || parseInt(targetValue) <= 0 || loading}
                            className={`flex-1 py-3 rounded-2xl font-bold text-white transition-all duration-200 bg-gradient-to-r ${selected.color} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                `Set ${selected.label} Target`
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </>
    );
};

// ─── Main Component ────────────────────────────────────────
const ManagerTargets = () => {
    const [teamProgress, setTeamProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingTarget, setSavingTarget] = useState(false);
    const [modalAgent, setModalAgent] = useState(null); // { agentId, name, role }
    const [period, setPeriod] = useState('monthly');
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => { fetchTeamProgress(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTeamProgress = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/targets/team-progress`, { headers });
            const data = await res.json();
            setTeamProgress(data.teamProgress || []);
        } catch (err) {
            console.error("Failed to fetch team progress:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTarget = async ({ period: p, targetCalls }) => {
        setSavingTarget(true);
        const now = new Date();
        try {
            const res = await fetch(`${API}/targets/manager`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: modalAgent.agentId,
                    period: p,
                    targetCalls,
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                    day: p === 'daily' ? now.getDate() : undefined
                })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`✅ ${p.charAt(0).toUpperCase() + p.slice(1)} target set for ${modalAgent.name}!`);
                setModalAgent(null);
                fetchTeamProgress();
            } else {
                showToast(data.message || 'Failed to set target', 'error');
            }
        } catch {
            showToast('Failed to set target', 'error');
        } finally {
            setSavingTarget(false);
        }
    };

    const periodColors = {
        daily:   { bar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-600' },
        weekly:  { bar: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-600'   },
        monthly: { bar: 'bg-violet-500', badge: 'bg-violet-50 text-violet-600' },
    };
    const pc = periodColors[period];

    return (
        <div className="space-y-6">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-medium text-sm transition-all ${
                    toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Modal */}
            {modalAgent && (
                <SetTargetModal
                    agent={modalAgent}
                    onClose={() => setModalAgent(null)}
                    onSave={handleSaveTarget}
                    loading={savingTarget}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Targets</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Set & track call targets for your team</p>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    {teamProgress.length} member{teamProgress.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                {['daily', 'weekly', 'monthly'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            period === p
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Loading team data...</p>
                    </div>
                ) : teamProgress.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-5xl mb-4">👥</p>
                        <p className="font-medium">No team members found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {['Agent', 'Target', 'Achieved', 'Progress', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {teamProgress.map((member, i) => {
                                    const pct = member[period]?.percentage || 0;
                                    const target = member[period]?.target || 0;
                                    const achieved = member[period]?.achieved || 0;

                                    return (
                                        <tr key={member.agentId} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === teamProgress.length - 1 ? 'border-0' : ''}`}>
                                            {/* Agent */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {member.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                                                        <p className="text-xs text-gray-400 capitalize">{member.role?.replace('_', ' ')}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Target */}
                                            <td className="px-6 py-4">
                                                {target > 0 ? (
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold ${pc.badge}`}>
                                                        {target} calls
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 text-sm font-medium">— Not set</span>
                                                )}
                                            </td>

                                            {/* Achieved */}
                                            <td className="px-6 py-4">
                                                <span className="text-lg font-bold text-gray-700">{achieved}</span>
                                                <span className="text-gray-400 text-xs ml-1">calls</span>
                                            </td>

                                            {/* Progress */}
                                            <td className="px-6 py-4 min-w-[160px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-700 ${
                                                                pct >= 100 ? 'bg-emerald-500' :
                                                                pct >= 80  ? 'bg-green-500'  :
                                                                pct >= 50  ? 'bg-yellow-500' :
                                                                pc.bar
                                                            }`}
                                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold w-9 text-right ${
                                                        pct >= 100 ? 'text-emerald-600' :
                                                        pct >= 80  ? 'text-green-600'  :
                                                        pct >= 50  ? 'text-yellow-600' :
                                                        'text-gray-500'
                                                    }`}>
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setModalAgent({ agentId: member.agentId, name: member.name, role: member.role })}
                                                    className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Set Target
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">💡</div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">About Targets</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2"><span className="text-orange-500">☀️</span><span><strong>Daily</strong> — Resets every day</span></div>
                            <div className="flex items-center gap-2"><span className="text-blue-500">📅</span><span><strong>Weekly</strong> — Mon to Sun</span></div>
                            <div className="flex items-center gap-2"><span className="text-violet-500">📊</span><span><strong>Monthly</strong> — Resets 1st</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerTargets;