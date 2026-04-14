import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const medals = ['🥇', '🥈', '🥉'];

const fmtDuration = (s) => {
    if (!s) return '0m';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function Leaderboard() {
    const [period, setPeriod] = useState('weekly');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoading(true);
        fetch(`${API}/calls/leaderboard?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { setData(d.leaderboard || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [period]);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Top performing agents</p>
                </div>
                {/* Period Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                    {['weekly', 'monthly'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {p === 'weekly' ? 'This Week' : 'This Month'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p>No data for this period</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((agent, idx) => (
                        <div
                            key={agent._id}
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${idx === 0 ? 'bg-amber-50 border-amber-200 shadow-sm' :
                                    idx === 1 ? 'bg-gray-50 border-gray-200' :
                                        idx === 2 ? 'bg-orange-50 border-orange-200' :
                                            'bg-white border-gray-100'
                                }`}
                        >
                            {/* Rank */}
                            <div className="w-8 text-center text-xl font-bold">
                                {idx < 3 ? medals[idx] : <span className="text-gray-400 text-sm">#{idx + 1}</span>}
                            </div>

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'][idx % 5]
                                }`}>
                                {(agent.agentName || 'U').charAt(0).toUpperCase()}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{agent.agentName}</p>
                                <p className="text-xs text-gray-400 truncate">{agent.agentEmail}</p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4 text-center">
                                <div>
                                    <p className="text-lg font-bold text-blue-600">{agent.totalCalls}</p>
                                    <p className="text-xs text-gray-400">Calls</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-emerald-600">{agent.salesDone}</p>
                                    <p className="text-xs text-gray-400">Sales</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-violet-600">{fmtDuration(agent.totalDuration)}</p>
                                    <p className="text-xs text-gray-400">Duration</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}