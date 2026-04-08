import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    rejected: 'bg-red-100 text-red-600 border border-red-200',
};

const LEAVE_TYPE_COLORS = {
    sick: 'bg-red-50 text-red-600 border border-red-100',
    casual: 'bg-blue-50 text-blue-600 border border-blue-100',
    earned: 'bg-purple-50 text-purple-600 border border-purple-100',
    unpaid: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── Review Modal ───────────────────────────────────────────────
const ReviewModal = ({ leave, onClose, onDone }) => {
    const [action, setAction] = useState('approved');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const handleSubmit = async () => {
        if (action === 'rejected' && !remarks.trim()) {
            setError('Please provide a rejection reason.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(
                `${API}/hr/leaves/${leave.hrRecordId}/${leave._id}/action`,
                { method: 'PATCH', headers, body: JSON.stringify({ action, remarks }) }
            );
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Action failed'); return; }
            onDone(action);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Review Leave Request</h3>
                            <p className="text-blue-100 text-xs">Admin Decision</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Employee Info Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {leave.employee?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{leave.employee?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{leave.employee?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-white rounded-lg p-2.5">
                                <p className="text-xs text-gray-400 mb-0.5">Leave Type</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                    {leave.leaveType}
                                </span>
                            </div>
                            <div className="bg-white rounded-lg p-2.5">
                                <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                                <p className="font-semibold text-gray-800">{leave.days} day(s)</p>
                            </div>
                            <div className="bg-white rounded-lg p-2.5">
                                <p className="text-xs text-gray-400 mb-0.5">From</p>
                                <p className="font-medium text-gray-800 text-xs">{fmt(leave.fromDate)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-2.5">
                                <p className="text-xs text-gray-400 mb-0.5">To</p>
                                <p className="font-medium text-gray-800 text-xs">{fmt(leave.toDate)}</p>
                            </div>
                        </div>
                        {leave.reason && (
                            <div className="mt-2 bg-white rounded-lg p-2.5">
                                <p className="text-xs text-gray-400 mb-0.5">Reason</p>
                                <p className="text-sm text-gray-700">{leave.reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Decision Buttons */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Decision</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAction('approved')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${action === 'approved'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                            </button>
                            <button
                                onClick={() => setAction('rejected')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${action === 'rejected'
                                    ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                            </button>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            {action === 'rejected' ? 'Rejection Reason *' : 'Remarks (optional)'}
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={3}
                            placeholder={action === 'rejected' ? 'State reason for rejection...' : 'Add a note for the employee...'}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Decision
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ label, count, icon, color, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left w-full ${active
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'}`}
    >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className={`text-2xl font-bold ${active ? 'text-blue-700' : 'text-gray-800'}`}>{count}</p>
            <p className={`text-xs font-medium ${active ? 'text-blue-500' : 'text-gray-500'}`}>{label}</p>
        </div>
    </button>
);

// ── Main Component ─────────────────────────────────────────────
const AdminLeaves = () => {
    const location = useLocation();
    const initStatus = new URLSearchParams(location.search).get('status') || '';

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState(initStatus);
    const [filterLeaveType, setFilterLeaveType] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [reviewLeave, setReviewLeave] = useState(null);
    const [toast, setToast] = useState({ msg: '', type: 'success' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
    };

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
            showToast('Failed to load leave requests', 'error');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterLeaveType, filterSearch, filterFrom, filterTo]);

    useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

    const handleActionDone = (action) => {
        setReviewLeave(null);
        showToast(`✅ Leave ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
        fetchLeaves();
    };

    const clearFilters = () => {
        setFilterSearch('');
        setFilterLeaveType('');
        setFilterFrom('');
        setFilterTo('');
    };

    const allLeaves = leaves;
    const counts = {
        all: allLeaves.length,
        pending: allLeaves.filter(l => l.status === 'pending').length,
        approved: allLeaves.filter(l => l.status === 'approved').length,
        rejected: allLeaves.filter(l => l.status === 'rejected').length,
    };

    const hasActiveFilters = filterSearch || filterLeaveType || filterFrom || filterTo;

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast.msg && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-7 bg-blue-600 rounded-full" />
                        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                    </div>
                    <p className="text-gray-500 text-sm pl-3">Review, approve or reject employee leave requests</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm font-semibold text-blue-700">{counts.pending} Pending</span>
                    <span className="text-blue-300">|</span>
                    <span className="text-sm text-blue-500">Admin View</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Requests"
                    count={counts.all}
                    active={filterStatus === ''}
                    onClick={() => setFilterStatus('')}
                    color="bg-blue-100"
                    icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatCard
                    label="Pending Review"
                    count={counts.pending}
                    active={filterStatus === 'pending'}
                    onClick={() => setFilterStatus('pending')}
                    color="bg-amber-100"
                    icon={<svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    label="Approved"
                    count={counts.approved}
                    active={filterStatus === 'approved'}
                    onClick={() => setFilterStatus('approved')}
                    color="bg-emerald-100"
                    icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    label="Rejected"
                    count={counts.rejected}
                    active={filterStatus === 'rejected'}
                    onClick={() => setFilterStatus('rejected')}
                    color="bg-red-100"
                    icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filters</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text" value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            placeholder="Search employee..."
                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <select
                        value={filterLeaveType} onChange={(e) => setFilterLeaveType(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600 bg-white"
                    >
                        <option value="">All Leave Types</option>
                        <option value="sick">🤒 Sick Leave</option>
                        <option value="casual">🌴 Casual Leave</option>
                        <option value="earned">💼 Earned Leave</option>
                        <option value="unpaid">💸 Unpaid Leave</option>
                    </select>
                    <div className="flex gap-2">
                        <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)}
                            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                            title="From date" />
                        <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} min={filterFrom}
                            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                            title="To date" />
                    </div>
                    <button onClick={clearFilters} disabled={!hasActiveFilters}
                        className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">
                        {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Requests` : 'All Requests'}
                        <span className="ml-2 text-xs font-normal text-gray-400">({leaves.length} records)</span>
                    </h2>
                    <button onClick={fetchLeaves} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading leave requests...</p>
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">No leave requests found</p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="mt-2 text-blue-500 text-xs hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    {['Employee', 'Leave Type', 'Duration', 'From — To', 'Applied On', 'Reason', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-blue-50/30 transition-colors group">
                                        {/* Employee */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                                    {leave.employee?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{leave.employee?.name}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{leave.employee?.role?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Leave Type */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${LEAVE_TYPE_COLORS[leave.leaveType]}`}>
                                                {leave.leaveType}
                                            </span>
                                        </td>

                                        {/* Days */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                {leave.days}d
                                            </span>
                                        </td>

                                        {/* Dates */}
                                        <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                                            <div className="font-medium">{fmt(leave.fromDate)}</div>
                                            <div className="text-gray-400 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                                {fmt(leave.toDate)}
                                            </div>
                                        </td>

                                        {/* Applied On */}
                                        <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                                            {fmt(leave.createdAt)}
                                        </td>

                                        {/* Reason */}
                                        <td className="px-5 py-4 text-sm text-gray-600 max-w-[140px]">
                                            <span className="truncate block" title={leave.reason}>
                                                {leave.reason || <span className="text-gray-300">—</span>}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1.5 rounded-full font-semibold capitalize ${STATUS_COLORS[leave.status]}`}>
                                                {leave.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            {leave.status === 'pending' ? (
                                                <button
                                                    onClick={() => setReviewLeave(leave)}
                                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Review
                                                </button>
                                            ) : leave.status === 'approved' ? (
                                                <div className="text-xs">
                                                    <p className="text-emerald-600 font-semibold flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approved
                                                    </p>
                                                    {leave.approvedBy?.name && <p className="text-gray-400">by {leave.approvedBy.name}</p>}
                                                </div>
                                            ) : (
                                                <div className="text-xs">
                                                    <p className="text-red-500 font-semibold flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Rejected
                                                    </p>
                                                    {leave.remarks && (
                                                        <p className="text-gray-400 italic max-w-[100px] truncate" title={leave.remarks}>
                                                            "{leave.remarks}"
                                                        </p>
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

            {/* Review Modal */}
            {reviewLeave && (
                <ReviewModal
                    leave={reviewLeave}
                    onClose={() => setReviewLeave(null)}
                    onDone={handleActionDone}
                />
            )}
        </div>
    );
};

export default AdminLeaves;