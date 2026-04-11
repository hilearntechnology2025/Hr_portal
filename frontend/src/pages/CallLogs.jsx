import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helpers ────────────────────────────────────────────────────
const fmtDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getPresetDates = (preset) => {
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];
    const sub = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };
    switch (preset) {
        case 'today': return { from: fmt(today), to: fmt(today) };
        case 'yesterday': return { from: fmt(sub(today, 1)), to: fmt(sub(today, 1)) };
        case 'last7': return { from: fmt(sub(today, 6)), to: fmt(today) };
        case 'last30': return { from: fmt(sub(today, 29)), to: fmt(today) };
        default: return { from: '', to: '' };
    }
};

// ── Badges ────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    const cfg = {
        Incoming: { cls: 'bg-blue-50 text-blue-700 border border-blue-200', icon: '↙' },
        Outgoing: { cls: 'bg-violet-50 text-violet-700 border border-violet-200', icon: '↗' },
    };
    const c = cfg[type] || cfg.Incoming;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
            <span className="text-sm leading-none">{c.icon}</span>{type}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const cfg = {
        Connected: { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
        Missed: { cls: 'bg-rose-50 text-rose-700 border border-rose-200', dot: 'bg-rose-500' },
        Rejected: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    };
    const c = cfg[status] || cfg.Missed;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
};

const avatarColors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];
const Avatar = ({ name, index }) => {
    const initials = (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className={`w-9 h-9 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {initials}
        </div>
    );
};

const SortIcon = ({ active, dir }) => {
    if (!active) return <span className="text-gray-300 text-xs ml-1">↕</span>;
    return <span className="text-blue-500 text-xs ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
};

const StatCard = ({ label, value, color, icon }) => (
    <div className={`rounded-2xl p-4 border ${color} flex items-center gap-3`}>
        <span className="text-2xl">{icon}</span>
        <div>
            <p className="text-xs font-medium opacity-70">{label}</p>
            <p className="text-2xl font-bold">{value ?? '—'}</p>
        </div>
    </div>
);

// ── Modal Field ───────────────────────────────────────────────
const ModalField = ({ label, required, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all";

// ── Add/Edit Modal ────────────────────────────────────────────
const CallModal = ({ log, onClose, onDone }) => {
    const isEdit = !!log;

    const toLocalDT = (d) => {
        if (!d) return '';
        const dt = new Date(d);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        return dt.toISOString().slice(0, 16);
    };

    // Form fields match backend model field names
    const [form, setForm] = useState(isEdit ? {
        customerName: log.customerName || '',
        customerNumber: log.customerNumber || '',   // use "customerNumber" as per backend model
        callType: log.callType || 'Outgoing',
        callStatus: log.callStatus || 'Connected',
        durationSeconds: log.durationSeconds || '', // use "durationSeconds" as per backend model
        calledAt: toLocalDT(log.calledAt),
        notes: log.notes || '',
        disposition: log.disposition || '',
        followUpDate: log.followUpDate || '',
        followUpNotes: log.followUpNotes || '',
    } : {
        customerName: '',
        customerNumber: '',        // ✅
        callType: 'Outgoing',
        callStatus: 'Connected',
        durationSeconds: '',       // ✅
        calledAt: toLocalDT(new Date()),
        notes: '',
        disposition: '',
        followUpDate: '',
        followUpNotes: '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        // Validate customerNumber (not phoneNumber)
        if (!form.customerNumber || !form.callType) {
            setError('Phone number and call type required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const url = isEdit ? `${API}/calls/${log._id}` : `${API}/calls`;
            const method = isEdit ? 'PUT' : 'POST';

            // Send correct field names expected by backend
            const body = {
                customerName: form.customerName,
                customerNumber: form.customerNumber,   // backend expects this field name
                callType: form.callType,
                callStatus: form.callStatus,
                durationSeconds: Number(form.durationSeconds) || 0,  // ✅
                calledAt: form.calledAt,
                notes: form.notes,
                disposition: form.disposition,           // ✅ ADD THIS
                followUpDate: form.followUpDate,         // ✅ ADD THIS
                followUpNotes: form.followUpNotes,
            };

            const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }
            onDone();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Call Log' : 'Add Call Log'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <ModalField label="Customer Name">
                            <input className={inp} value={form.customerName}
                                onChange={e => set('customerName', e.target.value)}
                                placeholder="Rahul Sharma" />
                        </ModalField>
                        {/* label: Phone Number, field: customerNumber */}
                        <ModalField label="Phone Number" required>
                            <input className={inp} value={form.customerNumber}
                                onChange={e => set('customerNumber', e.target.value)}
                                placeholder="+91 98765 43210" />
                        </ModalField>
                        <ModalField label="Call Type" required>
                            <select className={`${inp} bg-white`} value={form.callType}
                                onChange={e => set('callType', e.target.value)}>
                                <option>Incoming</option>
                                <option>Outgoing</option>
                            </select>
                        </ModalField>

                        <ModalField label="Call Status">
                            <select className={`${inp} bg-white`} value={form.callStatus}
                                onChange={e => set('callStatus', e.target.value)}>
                                <option>Connected</option>
                                <option>Missed</option>
                                <option>Rejected</option>
                            </select>
                        </ModalField>
                        {/* // After callStatus field, add: */}
                        <ModalField label="Call Disposition">
                            <select className={`${inp} bg-white`} value={form.disposition || ""}
                                onChange={e => set('disposition', e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="Interested">✅ Interested</option>
                                <option value="Not Interested">❌ Not Interested</option>
                                <option value="Callback">📞 Callback</option>
                                <option value="Sale Done">💰 Sale Done</option>
                                <option value="Wrong Number">🔢 Wrong Number</option>
                                <option value="Follow-up">⏰ Follow-up</option>
                            </select>
                        </ModalField>

                        <ModalField label="Follow-up Date">
                            <input type="datetime-local" className={inp} value={form.followUpDate || ""}
                                onChange={e => set('followUpDate', e.target.value)} />
                        </ModalField>

                        <ModalField label="Follow-up Notes">
                            <textarea className={`${inp} resize-none`} rows={2} value={form.followUpNotes || ""}
                                onChange={e => set('followUpNotes', e.target.value)} />
                        </ModalField>
                        {/* field: durationSeconds */}
                        <ModalField label="Duration (seconds)">
                            <input className={inp} type="number" min="0"
                                value={form.durationSeconds}
                                onChange={e => set('durationSeconds', e.target.value)}
                                placeholder="0" />
                        </ModalField>
                        <ModalField label="Date & Time">
                            <input className={inp} type="datetime-local" value={form.calledAt}
                                onChange={e => set('calledAt', e.target.value)} />
                        </ModalField>
                    </div>
                    <ModalField label="Notes">
                        <textarea className={`${inp} resize-none`} rows={2} value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Optional notes..." />
                    </ModalField>
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSubmit} disabled={saving}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">
                            {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Call'}
                        </button>
                        <button onClick={onClose}
                            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Delete Confirm ────────────────────────────────────────────
const DeleteConfirm = ({ log, onClose, onDone }) => {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleDelete = async () => {
        setLoading(true);
        try {
            await fetch(`${API}/calls/${log._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            onDone();
        } catch { onClose(); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center space-y-4">
                <div className="text-4xl">🗑️</div>
                <p className="font-bold text-gray-800">Delete this call log?</p>
                <p className="text-sm text-gray-500">{log.customerName} — {log.customerNumber}</p>
                <div className="flex gap-3">
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl">
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                    <button onClick={onClose}
                        className="flex-1 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 py-2.5">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const ITEMS_PER_PAGE = 15;

const CallLogs = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'agent';
    const headers = { Authorization: `Bearer ${token}` };
    const isAdmin = ['admin', 'super_admin'].includes(userRole);
    const canDelete = userRole === 'super_admin';

    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [activePreset, setActivePreset] = useState('');
    const [page, setPage] = useState(1);

    const [sortField, setSortField] = useState('calledAt');
    const [sortDir, setSortDir] = useState('desc');

    const [showAdd, setShowAdd] = useState(false);
    const [editLog, setEditLog] = useState(null);
    const [deleteLog, setDeleteLog] = useState(null);

    const [showImport, setShowImport] = useState(false);
    const [importData, setImportData] = useState('');
    const [importing, setImporting] = useState(false);

    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Backend returns data.logs and data.pagination
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: ITEMS_PER_PAGE,
                sortField,
                sortDir,
            });
            if (search) params.set('search', search);
            if (typeFilter !== 'All') params.set('callType', typeFilter);
            if (statusFilter !== 'All') params.set('callStatus', statusFilter);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);
            if (selectedAgent) params.set('agentId', selectedAgent);

            const res = await fetch(`${API}/calls?${params}`, { headers });
            const data = await res.json();

            // Backend returns logs and pagination
            setLogs(data.logs || []);
            setPagination(data.pagination || { total: 0, pages: 1 });
        } catch {
            showToast('❌ Failed to load call logs');
        } finally {
            setLoading(false);
        }
    }, [page, search, typeFilter, statusFilter, dateFrom, dateTo, sortField, sortDir, selectedAgent]);

    const fetchStats = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);
            const res = await fetch(`${API}/calls/stats?${params}`, { headers });
            const data = await res.json();
            setStats(data);
        } catch { }
    }, [dateFrom, dateTo]);

    useEffect(() => {
        if (isAdmin) {
            const fetchAgents = async () => {
                try {
                    const res = await fetch(`${API}/admin/users?role=agent&limit=100`, { headers });
                    const data = await res.json();
                    setAgents(data.users || []);
                } catch (err) {
                    console.error("Failed to fetch agents:", err);
                }
            };
            fetchAgents();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (userRole === 'manager') {
            const fetchTeamMembers = async () => {
                try {
                    const res = await fetch(`${API}/manager/team?limit=100`, { headers });
                    const data = await res.json();
                    setAgents(data.members || []);
                } catch (err) {
                    console.error("Failed to fetch team members:", err);
                }
            };
            fetchTeamMembers();
        }
    }, [userRole]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
        setPage(1);
    };

    const applyPreset = (preset) => {
        const { from, to } = getPresetDates(preset);
        setDateFrom(from); setDateTo(to);
        setActivePreset(preset); setPage(1);
    };

    const resetAll = () => {
        setSearch(''); setTypeFilter('All'); setStatusFilter('All');
        setDateFrom(''); setDateTo(''); setActivePreset(''); setPage(1);
    };

    const hasFilters = search || typeFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo;

    const onDone = (msg = '✅ Done') => {
        setShowAdd(false); setEditLog(null); setDeleteLog(null);
        showToast(msg);
        fetchLogs(); fetchStats();
    };

    const thCls = "text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700";

    // const handleBulkImport = async () => {
    //     setImporting(true);
    //     try {
    //         const rows = importData.split('\n').slice(1); // Skip header
    //         const calls = rows.filter(row => row.trim()).map(row => {
    //             const [customerName, customerNumber, callType, callStatus, durationSeconds, calledAt, notes] = row.split(',');
    //             return { customerName, customerNumber, callType, callStatus, durationSeconds, calledAt, notes };
    //         });



    //         const res = await fetch(`${API}/calls/bulk-import`, {
    //             method: 'POST',
    //             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ calls })
    //         });
    //         const data = await res.json();
    //         showToast(data.message);
    //         setShowImport(false);
    //         fetchLogs();
    //         fetchStats();
    //     } catch (err) {
    //         showToast('Import failed', 'error');
    //     } finally {
    //         setImporting(false);
    //     }
    // };

    const handleBulkImport = async () => {
        setImporting(true);
        try {
            const rows = importData.split('\n').slice(1); // Skip header
            const calls = rows.filter(row => row.trim()).map(row => {
                const [customerName, customerNumber, callType, callStatus, durationSeconds, calledAt, notes] = row.split(',');

                // ✅ Format data correctly
                let formattedCallType = callType?.trim() || 'Outgoing';
                if (formattedCallType.toLowerCase() === 'incoming') formattedCallType = 'Incoming';
                if (formattedCallType.toLowerCase() === 'outgoing') formattedCallType = 'Outgoing';

                let formattedStatus = callStatus?.trim() || 'Connected';
                if (formattedStatus.toLowerCase() === 'connected') formattedStatus = 'Connected';
                if (formattedStatus.toLowerCase() === 'missed') formattedStatus = 'Missed';
                if (formattedStatus.toLowerCase() === 'rejected') formattedStatus = 'Rejected';

                // ✅ Parse date properly
                let formattedDate = null;
                if (calledAt && calledAt.trim()) {
                    formattedDate = new Date(calledAt.trim());
                    if (isNaN(formattedDate.getTime())) {
                        formattedDate = new Date(); // fallback to current date
                    }
                }

                return {
                    customerName: customerName?.trim() || 'Unknown',
                    customerNumber: customerNumber?.trim() || '',
                    callType: formattedCallType,
                    callStatus: formattedStatus,
                    durationSeconds: parseInt(durationSeconds) || 0,
                    calledAt: formattedDate,
                    notes: notes?.trim() || ''
                };
            });

            // Filter out invalid calls (without phone number)
            const validCalls = calls.filter(call => call.customerNumber);

            if (validCalls.length === 0) {
                showToast('No valid calls to import. Please check phone numbers.', 'error');
                setImporting(false);
                return;
            }

            const res = await fetch(`${API}/calls/bulk-import`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ calls: validCalls })
            });
            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || 'Import failed', 'error');
            } else {
                showToast(data.message);
                setShowImport(false);
                setImportData('');
                fetchLogs();
                fetchStats();
            }
        } catch (err) {
            console.error('Import error:', err);
            showToast('Import failed: ' + err.message, 'error');
        } finally {
            setImporting(false);
        }
    };


    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Call Logs</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {pagination.total} total calls
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                        + Add Call
                    </button>
                    <button onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
                        📥 Bulk Import
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                    <StatCard label="Total" value={stats.total} color="bg-blue-50 border-blue-100 text-blue-800" icon="📞" />
                    <StatCard label="Incoming" value={stats.incoming} color="bg-indigo-50 border-indigo-100 text-indigo-800" icon="↙️" />
                    <StatCard label="Outgoing" value={stats.outgoing} color="bg-violet-50 border-violet-100 text-violet-800" icon="↗️" />
                    <StatCard label="Connected" value={stats.connected} color="bg-emerald-50 border-emerald-100 text-emerald-800" icon="✅" />
                    <StatCard label="Missed" value={stats.missed} color="bg-rose-50 border-rose-100 text-rose-800" icon="📵" />
                    {/* stats.todayCalls — field from backend */}
                    <StatCard label="Today" value={stats.todayCalls} color="bg-amber-50 border-amber-100 text-amber-800" icon="📅" />
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                <div className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Search name or number..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {['All', 'Incoming', 'Outgoing'].map(t => (
                        <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${typeFilter === t ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {t}
                        </button>
                    ))}
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                        <option value="All">All Status</option>
                        <option value="Connected">Connected</option>
                        <option value="Missed">Missed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    {/* {isAdmin && agents.length > 0 && (
                        <select
                            value={selectedAgent}
                            onChange={e => { setSelectedAgent(e.target.value); setPage(1); }}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            <option value="">All Agents</option>
                            {agents.map(agent => (
                                <option key={agent._id} value={agent._id}>{agent.name}</option>
                            ))}
                        </select>
                    )} */}
                    {(isAdmin || userRole === 'manager') && agents.length > 0 && (
                        <select
                            value={selectedAgent}
                            onChange={e => { setSelectedAgent(e.target.value); setPage(1); }}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            <option value="">All Agents ({agents.length})</option>
                            {agents.map(agent => (
                                <option key={agent._id} value={agent._id}>{agent.name}</option>
                            ))}
                        </select>
                    )}

                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    {[
                        { key: 'today', label: 'Today' },
                        { key: 'yesterday', label: 'Yesterday' },
                        { key: 'last7', label: 'Last 7d' },
                        { key: 'last30', label: 'Last 30d' },
                    ].map(p => (
                        <button key={p.key} onClick={() => applyPreset(p.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activePreset === p.key ? 'bg-blue-100 text-blue-700' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                            {p.label}
                        </button>
                    ))}
                    <input type="date" value={dateFrom}
                        onChange={e => { setDateFrom(e.target.value); setActivePreset(''); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <span className="text-gray-400 text-xs">→</span>
                    <input type="date" value={dateTo}
                        onChange={e => { setDateTo(e.target.value); setActivePreset(''); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    {hasFilters && (
                        <button onClick={resetAll} className="ml-auto px-3 py-1.5 text-xs text-red-500 hover:text-red-700 font-medium">
                            ✕ Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-3">📞</p>
                        <p className="text-sm font-medium">No call logs found</p>
                        {hasFilters && <p className="text-xs mt-1">Try resetting filters</p>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className={thCls} onClick={() => handleSort('customerName')}>
                                        Customer <SortIcon active={sortField === 'customerName'} dir={sortDir} />
                                    </th>
                                    <th className={`${thCls} cursor-default`}>Type</th>
                                    <th className={`${thCls} cursor-default`}>Status</th>
                                    <th className={thCls} onClick={() => handleSort('durationSeconds')}>
                                        Duration <SortIcon active={sortField === 'durationSeconds'} dir={sortDir} />
                                    </th>
                                    <th className={thCls} onClick={() => handleSort('calledAt')}>
                                        Date & Time <SortIcon active={sortField === 'calledAt'} dir={sortDir} />
                                    </th>
                                    {isAdmin && <th className={`${thCls} cursor-default`}>Agent</th>}
                                    <th className={`${thCls} cursor-default`}>Actions</th>
                                    <th className={thCls}>Disposition</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map((log, idx) => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={log.customerName} index={idx} />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{log.customerName}</p>
                                                    {/* display customerNumber */}
                                                    <p className="text-xs text-gray-400">{log.customerNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5"><TypeBadge type={log.callType} /></td>
                                        <td className="px-5 py-3.5"><StatusBadge status={log.callStatus} /></td>
                                        {/* use durationSeconds */}
                                        <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{fmtDuration(log.durationSeconds)}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm text-gray-800">{fmtDate(log.calledAt)}</p>
                                            <p className="text-xs text-gray-400">{fmtTime(log.calledAt)}</p>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm text-gray-700">{log.agent?.name || '—'}</p>
                                                <p className="text-xs text-gray-400">{log.agent?.role}</p>
                                            </td>
                                        )}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setEditLog(log)}
                                                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                                                    Edit
                                                </button>
                                                {canDelete && (
                                                    <button onClick={() => setDeleteLog(log)}
                                                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs px-2 py-1 rounded-full ${log.disposition === 'Interested' ? 'bg-green-100 text-green-700' :
                                                log.disposition === 'Not Interested' ? 'bg-red-100 text-red-600' :
                                                    log.disposition === 'Sale Done' ? 'bg-purple-100 text-purple-700' :
                                                        log.disposition === 'Callback' ? 'bg-yellow-100 text-yellow-700' :
                                                            log.disposition === 'Wrong Number' ? 'bg-gray-100 text-gray-600' :
                                                                log.disposition === 'Follow-up' ? 'bg-blue-100 text-blue-600' :
                                                                    'bg-gray-100 text-gray-400'
                                                }`}>
                                                {log.disposition || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, pagination.total)} of {pagination.total}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50">
                            ← Prev
                        </button>
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            const p = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
                            return (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            );
                        })}
                        <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50">
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {showImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Bulk Import Calls</h3>
                        <p className="text-sm text-gray-500 mb-3">CSV Format: customerName,customerNumber,callType,callStatus,durationSeconds,calledAt,notes</p>
                        <textarea
                            className="w-full h-64 border rounded-xl p-3 font-mono text-sm"
                            value={importData}
                            onChange={e => setImportData(e.target.value)}
                            // placeholder="customerName,customerNumber,callType,callStatus,durationSeconds,calledAt,notes&#10;Rahul,9876543210,Outgoing,Connected,120,2024-01-15T10:30:00,Follow up"
                            placeholder={`Example (first line is header, will be skipped):
customerName,customerNumber,callType,callStatus,durationSeconds,calledAt,notes
Rahul,9876543210,Outgoing,Connected,120,2026-04-10T10:30:00,Follow up
Shani,9601930581,Incoming,Connected,60,2026-04-10T11:00:00,Interested`}
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={handleBulkImport} disabled={importing} className="flex-1 bg-blue-600 text-white py-2 rounded-xl">
                                {importing ? 'Importing...' : 'Import'}
                            </button>
                            <button onClick={() => setShowImport(false)} className="flex-1 border py-2 rounded-xl">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAdd && <CallModal onClose={() => setShowAdd(false)} onDone={() => onDone('✅ Call log added')} />}
            {editLog && <CallModal log={editLog} onClose={() => setEditLog(null)} onDone={() => onDone('✅ Call log updated')} />}
            {deleteLog && <DeleteConfirm log={deleteLog} onClose={() => setDeleteLog(null)} onDone={() => onDone('🗑️ Call log deleted')} />}
        </div>
    );
};

export default CallLogs;