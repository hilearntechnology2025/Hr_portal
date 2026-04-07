import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-600 border-red-200',
};

const STATUS_ICONS = { pending: '⏳', approved: '✅', rejected: '❌' };

const LEAVE_TYPE_COLORS = {
    sick: 'bg-red-50 text-red-600',
    casual: 'bg-blue-50 text-blue-600',
    earned: 'bg-purple-50 text-purple-600',
    unpaid: 'bg-gray-100 text-gray-600',
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const calcDays = (from, to) => {
    if (!from || !to) return 0;
    let days = 0;
    const cur = new Date(from);
    const end = new Date(to);
    while (cur <= end) {
        const dow = cur.getDay();
        if (dow !== 0 && dow !== 6) days++;
        cur.setDate(cur.getDate() + 1);
    }
    return days || 1;
};

// ── Apply Leave Modal ─────────────────────────────────────────
const ApplyModal = ({ onClose, onDone }) => {
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({ leaveType: 'sick', fromDate: today, toDate: today, reason: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const days = calcDays(form.fromDate, form.toDate);

    const handleSubmit = async () => {
        if (!form.fromDate || !form.toDate) { setError('Please select dates'); return; }
        if (new Date(form.toDate) < new Date(form.fromDate)) { setError('End date must be after start date'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/hr/my-leaves`, {
                method: 'POST',
                headers,
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }
            onDone();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Apply for Leave</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Submit your leave request for HR approval</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['sick', 'casual', 'earned', 'unpaid'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setForm(f => ({ ...f, leaveType: type }))}
                                    className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-colors capitalize ${form.leaveType === type
                                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {type === 'sick' && '🤒 '}
                                    {type === 'casual' && '🌴 '}
                                    {type === 'earned' && '💼 '}
                                    {type === 'unpaid' && '💸 '}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                            <input
                                type="date"
                                value={form.fromDate}
                                min={today}
                                onChange={(e) => setForm(f => ({
                                    ...f, fromDate: e.target.value,
                                    toDate: f.toDate < e.target.value ? e.target.value : f.toDate
                                }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                            <input
                                type="date"
                                value={form.toDate}
                                min={form.fromDate || today}
                                onChange={(e) => setForm(f => ({ ...f, toDate: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>

                    {/* Days preview */}
                    {form.fromDate && form.toDate && (
                        <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5 text-sm text-blue-700">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span><strong>{days}</strong> working day{days !== 1 ? 's' : ''} requested</span>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            value={form.reason}
                            onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
                            rows={3}
                            placeholder="Briefly describe the reason for your leave..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            {loading ? 'Submitting...' : '📤 Submit Request'}
                        </button>
                        <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const EmployeeLeaves = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [leaves, setLeaves] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState({ sick: 12, casual: 12, earned: 15 });
    const [loading, setLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

    const fetchMyLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/hr/my-leaves`, { headers });
            const data = await res.json();
            setLeaves(data.leaves || []);
            if (data.leaveBalance) setLeaveBalance(data.leaveBalance);
        } catch {
            showToast('❌ Failed to load your leaves');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMyLeaves(); }, [fetchMyLeaves]);

    const handleApplied = () => {
        setShowApply(false);
        showToast('✅ Leave request submitted successfully!');
        fetchMyLeaves();
    };

    const displayed = filterStatus ? leaves.filter(l => l.status === filterStatus) : leaves;

    const counts = {
        all: leaves.length,
        pending: leaves.filter(l => l.status === 'pending').length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length,
    };

    const BALANCE_CARDS = [
        { key: 'sick', label: 'Sick Leave', icon: '🤒', color: 'red', total: 12 },
        { key: 'casual', label: 'Casual Leave', icon: '🌴', color: 'blue', total: 12 },
        { key: 'earned', label: 'Earned Leave', icon: '💼', color: 'purple', total: 15 },
    ];

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Leaves</h1>
                    <p className="text-gray-500 text-sm mt-1">Apply for leave and track your requests</p>
                </div>
                <button
                    onClick={() => setShowApply(true)}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Apply for Leave
                </button>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BALANCE_CARDS.map(({ key, label, icon, color, total }) => {
                    const used = total - (leaveBalance[key] ?? total);
                    const remaining = leaveBalance[key] ?? total;
                    const pct = Math.round((remaining / total) * 100);
                    return (
                        <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{remaining}
                                        <span className="text-sm text-gray-400 font-normal"> / {total}</span>
                                    </p>
                                </div>
                                <span className="text-3xl">{icon}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${color === 'red' ? 'bg-red-400' : color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                                <span>{used} used</span>
                                <span>{remaining} left</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: '', label: 'All', count: counts.all },
                    { key: 'pending', label: '⏳ Pending', count: counts.pending },
                    { key: 'approved', label: '✅ Approved', count: counts.approved },
                    { key: 'rejected', label: '❌ Rejected', count: counts.rejected },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === tab.key
                            ? 'bg-yellow-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-5xl mb-3">📭</div>
                        <p className="text-sm font-medium text-gray-500">
                            {filterStatus ? `No ${filterStatus} leaves found` : 'No leave requests yet'}
                        </p>
                        {!filterStatus && (
                            <button
                                onClick={() => setShowApply(true)}
                                className="mt-4 text-yellow-600 text-sm font-medium hover:underline"
                            >
                                Apply for your first leave →
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        {['Leave Type', 'Duration', 'Days', 'Reason', 'Applied On', 'Status', 'Remarks'].map(h => (
                                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {displayed.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                                    {leave.leaveType}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                                                <div>{fmt(leave.fromDate)}</div>
                                                <div className="text-gray-400">→ {fmt(leave.toDate)}</div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">{leave.days}d</td>
                                            <td className="px-5 py-4 text-sm text-gray-600 max-w-[160px]">
                                                <span className="truncate block" title={leave.reason}>{leave.reason || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{fmt(leave.createdAt)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${STATUS_COLORS[leave.status]}`}>
                                                    {STATUS_ICONS[leave.status]} {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500 max-w-[160px]">
                                                {leave.remarks ? (
                                                    <span className="italic truncate block" title={leave.remarks}>"{leave.remarks}"</span>
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {displayed.map((leave) => (
                                <div key={leave._id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                            {leave.leaveType}
                                        </span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${STATUS_COLORS[leave.status]}`}>
                                            {STATUS_ICONS[leave.status]} {leave.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{fmt(leave.fromDate)} → {fmt(leave.toDate)}</span>
                                        <span className="font-semibold text-gray-800">{leave.days}d</span>
                                    </div>
                                    {leave.reason && <p className="text-sm text-gray-500">{leave.reason}</p>}
                                    {leave.remarks && (
                                        <p className="text-xs text-gray-400 italic">HR: "{leave.remarks}"</p>
                                    )}
                                    <p className="text-xs text-gray-400">Applied {fmt(leave.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {showApply && <ApplyModal onClose={() => setShowApply(false)} onDone={handleApplied} />}
        </div>
    );
};

export default EmployeeLeaves;
