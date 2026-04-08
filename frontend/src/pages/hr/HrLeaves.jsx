import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
};

const LEAVE_TYPE_COLORS = {
    sick: 'bg-red-50 text-red-600',
    casual: 'bg-blue-50 text-blue-600',
    earned: 'bg-purple-50 text-purple-600',
    unpaid: 'bg-gray-100 text-gray-600',
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── Action Modal ───────────────────────────────────────────────
const ActionModal = ({ leave, onClose, onDone }) => {
    const [action, setAction] = useState('approved');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(
                `${API}/hr/leaves/${leave.hrRecordId}/${leave._id}/action`,
                { method: 'PATCH', headers, body: JSON.stringify({ action, remarks }) }
            );
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Review Leave Request</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-5">
                    {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Employee</span>
                            <span className="font-semibold text-gray-800">{leave.employee?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Leave Type</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                {leave.leaveType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-medium text-gray-800">{leave.days} day(s)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Dates</span>
                            <span className="text-gray-800">{fmt(leave.fromDate)} → {fmt(leave.toDate)}</span>
                        </div>
                        {leave.reason && (
                            <div>
                                <span className="text-gray-500 block">Reason</span>
                                <span className="text-gray-800">{leave.reason}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAction('approved')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${action === 'approved'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                ✅ Approve
                            </button>
                            <button
                                onClick={() => setAction('rejected')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${action === 'rejected'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                ❌ Reject
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {action === 'rejected' ? 'Rejection Reason *' : 'Remarks (optional)'}
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={3}
                            placeholder={action === 'rejected' ? 'State reason for rejection...' : 'Add a note for the employee...'}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Submit Decision'}
                        </button>
                        <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────
const HrLeaves = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initStatus = params.get('status') || '';

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState(initStatus);
    const [filterLeaveType, setFilterLeaveType] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [actionLeave, setActionLeave] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const qp = new URLSearchParams();
            if (filterStatus) qp.set('status', filterStatus);
            if (filterLeaveType) qp.set('leaveType', filterLeaveType);
            if (filterSearch) qp.set('search', filterSearch);
            if (filterFrom) qp.set('fromDate', filterFrom);
            if (filterTo) qp.set('toDate', filterTo);
            const res = await fetch(`${API}/hr/leaves?${qp}`, { headers });
            const data = await res.json();
            setLeaves(data.leaves || []);
        } catch {
            showToast('❌ Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterLeaveType, filterSearch, filterFrom, filterTo]);

    useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

    const handleActionDone = () => {
        setActionLeave(null);
        showToast('✅ Leave decision submitted');
        fetchLeaves();
    };

    const clearFilters = () => {
        setFilterSearch('');
        setFilterLeaveType('');
        setFilterFrom('');
        setFilterTo('');
    };

    const hasActiveFilters = filterSearch || filterLeaveType || filterFrom || filterTo;

    // Tab counts: always show counts per status of the currently fetched set
    const allCount = leaves.length;
    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const approvedCount = leaves.filter(l => l.status === 'approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

    const TABS = [
        { key: '', label: 'All', count: allCount, emoji: '' },
        { key: 'pending', label: 'Pending', count: pendingCount, emoji: '⏳' },
        { key: 'approved', label: 'Approved', count: approvedCount, emoji: '✅' },
        { key: 'rejected', label: 'Rejected', count: rejectedCount, emoji: '❌' },
    ];

    const getApprovedByName = (leave) => {
        if (!leave.approvedBy) return null;
        if (typeof leave.approvedBy === 'object' && leave.approvedBy.name) return leave.approvedBy.name;
        return null;
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
                <p className="text-gray-500 text-sm mt-1">Review and manage employee leave requests</p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === tab.key
                            ? 'bg-yellow-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab.emoji && <span className="mr-1">{tab.emoji}</span>}
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            placeholder="Search employee..."
                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Leave Type */}
                    <select
                        value={filterLeaveType}
                        onChange={(e) => setFilterLeaveType(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
                    >
                        <option value="">All Leave Types</option>
                        <option value="sick">🤒 Sick</option>
                        <option value="casual">🌴 Casual</option>
                        <option value="earned">💼 Earned</option>
                        <option value="unpaid">💸 Unpaid</option>
                    </select>

                    {/* Date Range */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={filterFrom}
                            onChange={(e) => setFilterFrom(e.target.value)}
                            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
                            title="From date"
                        />
                        <input
                            type="date"
                            value={filterTo}
                            onChange={(e) => setFilterTo(e.target.value)}
                            min={filterFrom}
                            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
                            title="To date"
                        />
                    </div>

                    {/* Clear */}
                    <button
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Leaves Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-5xl mb-3">📋</div>
                        <p className="text-sm font-medium">No leave requests found</p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="mt-3 text-yellow-600 text-xs hover:underline">
                                Clear filters to see all
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {['Employee', 'Type', 'From – To', 'Days', 'Reason', 'Applied', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Employee */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs flex-shrink-0">
                                                    {leave.employee?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{leave.employee?.name}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{leave.employee?.role?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                                {leave.leaveType}
                                            </span>
                                        </td>

                                        {/* Dates */}
                                        <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                                            <div>{fmt(leave.fromDate)}</div>
                                            <div className="text-gray-400">→ {fmt(leave.toDate)}</div>
                                        </td>

                                        {/* Days */}
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                            {leave.days}d
                                        </td>

                                        {/* Reason */}
                                        <td className="px-5 py-4 text-sm text-gray-600 max-w-[140px]">
                                            <span className="truncate block" title={leave.reason}>
                                                {leave.reason || '—'}
                                            </span>
                                        </td>

                                        {/* Applied Date */}
                                        <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                                            {fmt(leave.createdAt)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[leave.status]}`}>
                                                {leave.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            {leave.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setActionLeave({ ...leave, _action: 'approved' }); }}
                                                        className="text-xs px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => { setActionLeave({ ...leave, _action: 'rejected' }); }}
                                                        className="text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </div>
                                            ) : leave.status === 'approved' ? (
                                                <div className="text-xs text-gray-500">
                                                    <div className="text-green-600 font-medium">Approved</div>
                                                    {getApprovedByName(leave) && (
                                                        <div>by {getApprovedByName(leave)}</div>
                                                    )}
                                                    {leave.approvedAt && <div>{fmt(leave.approvedAt)}</div>}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-500">
                                                    <div className="text-red-500 font-medium">Rejected</div>
                                                    {getApprovedByName(leave) && (
                                                        <div>by {getApprovedByName(leave)}</div>
                                                    )}
                                                    {leave.remarks && (
                                                        <div className="text-gray-400 italic max-w-[120px] truncate" title={leave.remarks}>
                                                            "{leave.remarks}"
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Action Modal */}
            {actionLeave && (
                <ActionModal
                    leave={actionLeave}
                    onClose={() => setActionLeave(null)}
                    onDone={handleActionDone}
                />
            )}
        </div>
    );
};

export default HrLeaves;
