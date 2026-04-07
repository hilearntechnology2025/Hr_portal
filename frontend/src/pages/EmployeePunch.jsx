import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helper: auth headers ─────────────────────────────────────
const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ── Helper: format time ──────────────────────────────────────
const fmt = (isoStr) => {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
};

const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[+m - 1]} ${y}`;
};

const fmtHours = (h) => {
    if (!h) return '0h 0m';
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
};

// ── Get GPS location ─────────────────────────────────────────
const getLocation = () =>
    new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: Math.round(pos.coords.accuracy),
            }),
            () => resolve(null),
            { timeout: 8000, enableHighAccuracy: true }
        );
    });

export default function EmployeePunch() {
    const [record, setRecord] = useState(null);
    const [today, setToday] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [locStatus, setLocStatus] = useState('idle'); // idle | fetching | got | denied
    const [location, setLocation] = useState(null);
    const [toast, setToast] = useState(null);
    const [history, setHistory] = useState([]);
    const [histLoading, setHistLoading] = useState(false);
    const [clock, setClock] = useState(new Date());

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Fetch today's status
    const fetchToday = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/attendance/today`, { headers: authHeaders() });
            const data = await res.json();
            setRecord(data.record);
            setToday(data.today);
        } catch {
            showToast('Failed to load attendance', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch history
    const fetchHistory = useCallback(async () => {
        setHistLoading(true);
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        try {
            const res = await fetch(`${API_BASE}/attendance/history?month=${month}`, {
                headers: authHeaders(),
            });
            const data = await res.json();
            setHistory(data.records || []);
        } catch {
            /* silent */
        } finally {
            setHistLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchToday();
        fetchHistory();
    }, [fetchToday, fetchHistory]);

    // Fetch GPS
    const handleFetchLocation = async () => {
        setLocStatus('fetching');
        const loc = await getLocation();
        if (loc) {
            setLocation(loc);
            setLocStatus('got');
        } else {
            setLocStatus('denied');
        }
    };

    // Punch In
    const handlePunchIn = async () => {
        setActionLoading(true);
        try {
            const body = location
                ? { ...location }
                : {};
            const res = await fetch(`${API_BASE}/attendance/punch-in`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.message, 'error');
            setRecord(data.record);
            showToast('✅ Punch In successful!');
            fetchHistory();
        } catch {
            showToast('Network error', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Punch Out
    const handlePunchOut = async () => {
        setActionLoading(true);
        try {
            const body = location ? { ...location } : {};
            const res = await fetch(`${API_BASE}/attendance/punch-out`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.message, 'error');
            setRecord(data.record);
            showToast('👋 Punch Out recorded!');
            fetchHistory();
        } catch {
            showToast('Network error', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const isPunchedIn = !!record?.punchIn?.time;
    const isPunchedOut = !!record?.punchOut?.time;

    // ── Elapsed time display ──────────────────────────────────
    const elapsed = isPunchedIn && !isPunchedOut
        ? ((clock - new Date(record.punchIn.time)) / (1000 * 60 * 60))
        : null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium transition-all
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
                    <p className="text-gray-500 text-sm mt-1">{fmtDate(today)} &nbsp;·&nbsp; {clock.toLocaleTimeString('en-IN', { hour12: true })}</p>
                </div>

                {/* ── Today Card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-gray-700 text-lg">Today's Status</h2>
                        {loading ? (
                            <span className="text-sm text-gray-400">Loading…</span>
                        ) : (
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full
                ${isPunchedOut ? 'bg-blue-100 text-blue-600'
                                    : isPunchedIn ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-500'}`}>
                                {isPunchedOut ? 'Completed' : isPunchedIn ? '🟢 Working' : 'Not Started'}
                            </span>
                        )}
                    </div>

                    {/* Punch times */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="text-xs text-green-600 font-medium mb-1">Punch In</div>
                            <div className="text-xl font-bold text-green-700">{fmt(record?.punchIn?.time)}</div>
                            {record?.punchIn?.location?.latitude && (
                                <a
                                    href={`https://maps.google.com/?q=${record.punchIn.location.latitude},${record.punchIn.location.longitude}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-green-500 underline mt-1 inline-block">
                                    📍 View location
                                </a>
                            )}
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                            <div className="text-xs text-red-500 font-medium mb-1">Punch Out</div>
                            <div className="text-xl font-bold text-red-600">{fmt(record?.punchOut?.time)}</div>
                            {record?.punchOut?.location?.latitude && (
                                <a
                                    href={`https://maps.google.com/?q=${record.punchOut.location.latitude},${record.punchOut.location.longitude}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-red-400 underline mt-1 inline-block">
                                    📍 View location
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Elapsed / Hours worked */}
                    {elapsed !== null && (
                        <div className="bg-blue-50 rounded-xl p-3 mb-4 text-center text-sm text-blue-700 font-medium">
                            ⏱ Time elapsed: <span className="font-bold">{fmtHours(elapsed)}</span>
                        </div>
                    )}
                    {isPunchedOut && (
                        <div className="bg-indigo-50 rounded-xl p-3 mb-4 text-center text-sm text-indigo-700 font-medium">
                            ✅ Total hours worked: <span className="font-bold">{fmtHours(record.hoursWorked)}</span>
                        </div>
                    )}

                    {/* Location section */}
                    {!isPunchedOut && (
                        <div className="mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleFetchLocation}
                                    disabled={locStatus === 'fetching' || locStatus === 'got'}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                    ${locStatus === 'got' ? 'bg-green-100 text-green-700 cursor-default'
                                            : locStatus === 'denied' ? 'bg-red-100 text-red-600'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                    {locStatus === 'fetching' ? '⏳ Fetching GPS…'
                                        : locStatus === 'got' ? `✅ GPS: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} (±${location.accuracy}m)`
                                            : locStatus === 'denied' ? '❌ Location denied — punch without GPS'
                                                : '📍 Share My Location'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Location is optional but recommended for attendance accuracy.</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {!loading && (
                        <div className="flex gap-3">
                            {!isPunchedIn && (
                                <button
                                    onClick={handlePunchIn}
                                    disabled={actionLoading}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 text-lg">
                                    {actionLoading ? 'Processing…' : '🟢 Punch In'}
                                </button>
                            )}
                            {isPunchedIn && !isPunchedOut && (
                                <button
                                    onClick={handlePunchOut}
                                    disabled={actionLoading}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 text-lg">
                                    {actionLoading ? 'Processing…' : '🔴 Punch Out'}
                                </button>
                            )}
                            {isPunchedOut && (
                                <div className="flex-1 bg-gray-100 text-gray-500 font-semibold py-3 rounded-xl text-center">
                                    ✅ Attendance Complete for Today
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── History ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-700 text-lg mb-4">This Month's History</h2>
                    {histLoading ? (
                        <p className="text-sm text-gray-400 text-center py-6">Loading history…</p>
                    ) : history.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No records this month</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 text-left text-xs border-b">
                                        <th className="pb-2 font-medium">Date</th>
                                        <th className="pb-2 font-medium">In</th>
                                        <th className="pb-2 font-medium">Out</th>
                                        <th className="pb-2 font-medium">Hours</th>
                                        <th className="pb-2 font-medium">Status</th>
                                        <th className="pb-2 font-medium">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {history.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50">
                                            <td className="py-2.5 font-medium text-gray-700">{fmtDate(r.date)}</td>
                                            <td className="py-2.5 text-green-600">{fmt(r.punchIn?.time)}</td>
                                            <td className="py-2.5 text-red-500">{fmt(r.punchOut?.time)}</td>
                                            <td className="py-2.5 text-gray-700">{r.hoursWorked ? fmtHours(r.hoursWorked) : '—'}</td>
                                            <td className="py-2.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${r.status === 'present' ? 'bg-green-100 text-green-700'
                                                        : r.status === 'half_day' ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-600'}`}>
                                                    {r.status === 'present' ? 'Present'
                                                        : r.status === 'half_day' ? 'Half Day'
                                                            : 'Absent'}
                                                </span>
                                            </td>
                                            <td className="py-2.5">
                                                {r.punchIn?.location?.latitude ? (
                                                    <a
                                                        href={`https://maps.google.com/?q=${r.punchIn.location.latitude},${r.punchIn.location.longitude}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="text-blue-500 underline text-xs">
                                                        📍 Map
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-300 text-xs">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}