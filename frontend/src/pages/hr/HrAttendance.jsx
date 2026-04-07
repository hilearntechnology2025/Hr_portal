import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_CONFIG = {
    present: { label: 'Present', color: 'bg-green-100 text-green-700' },
    absent: { label: 'Absent', color: 'bg-red-100 text-red-600' },
    half_day: { label: 'Half Day', color: 'bg-yellow-100 text-yellow-700' },
    work_from_home: { label: 'WFH', color: 'bg-blue-100 text-blue-600' },
    holiday: { label: 'Holiday', color: 'bg-purple-100 text-purple-600' },
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// ── helpers ───────────────────────────────────────────────────
const fmtTime = (isoStr) => {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

const fmtHours = (h) => {
    if (!h) return '—';
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
};

// ── Main Component ─────────────────────────────────────────────
const HrAttendance = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loadingEmps, setLoadingEmps] = useState(true);
    const [loadingAtt, setLoadingAtt] = useState(false);
    const [toast, setToast] = useState('');

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // ── Load employees ────────────────────────────────────────
    useEffect(() => {
        const fetchEmps = async () => {
            try {
                const res = await fetch(`${API}/hr/employees?limit=100`, { headers });
                const data = await res.json();
                setEmployees(data.employees || []);
                if (data.employees?.length) setSelectedEmp(data.employees[0]);
            } catch { showToast('❌ Failed to load employees'); }
            finally { setLoadingEmps(false); }
        };
        fetchEmps();
    }, []);

    // ── Load attendance from NEW Attendance collection ────────
    //    GET /api/attendance/all?month=YYYY-MM
    //    then filter by selectedEmp._id on the client
    const fetchAttendance = useCallback(async () => {
        if (!selectedEmp) return;
        setLoadingAtt(true);
        try {
            const mm = String(month).padStart(2, '0');
            const monthStr = `${year}-${mm}`;
            const res = await fetch(
                `${API}/attendance/all?month=${monthStr}`,
                { headers }
            );
            const data = await res.json();

            // Filter only the selected employee's records
            const empRecords = (data.records || []).filter(
                (r) => (r.employee?._id || r.employee) === selectedEmp._id
            );
            setAttendance(empRecords);
        } catch { showToast('❌ Failed to load attendance'); }
        finally { setLoadingAtt(false); }
    }, [selectedEmp, month, year]);

    useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

    // ── Summary counts ────────────────────────────────────────
    const summary = {
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        half_day: attendance.filter(a => a.status === 'half_day').length,
        work_from_home: attendance.filter(a => a.status === 'work_from_home').length,
        holiday: attendance.filter(a => a.status === 'holiday').length,
    };

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
                    <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
                    <p className="text-gray-500 text-sm mt-1">Employee punch-in / punch-out records</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* ── Employee List ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 max-h-[600px] overflow-y-auto">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Employees</p>
                    {loadingEmps ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        employees.map((emp) => (
                            <button
                                key={emp._id}
                                onClick={() => setSelectedEmp(emp)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${selectedEmp?._id === emp._id
                                        ? 'bg-yellow-50 border border-yellow-200'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs flex-shrink-0">
                                    {emp.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                                    <p className="text-xs text-gray-400">{emp.role}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* ── Attendance Content ── */}
                <div className="lg:col-span-3 space-y-5">

                    {/* Month/Year Filter */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
                        <select value={month} onChange={e => setMonth(Number(e.target.value))}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
                            {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                        </select>
                        <select value={year} onChange={e => setYear(Number(e.target.value))}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
                            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        {selectedEmp && (
                            <span className="text-sm font-semibold text-gray-700">
                                📅 {selectedEmp.name} — {MONTHS[month - 1]} {year}
                            </span>
                        )}
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <div key={key} className={`rounded-xl p-3 text-center ${cfg.color.split(' ')[0]}`}>
                                <p className="text-2xl font-bold text-gray-800">{summary[key] || 0}</p>
                                <p className={`text-xs font-medium mt-0.5 ${cfg.color.split(' ')[1]}`}>{cfg.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {loadingAtt ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : attendance.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-3xl mb-2">📅</p>
                                <p className="text-sm">No attendance records found for this month</p>
                                <p className="text-xs mt-1 text-gray-300">Records appear when employee punches in via My Attendance</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            {['Date', 'Status', 'Punch In', 'Punch Out', 'Hours', 'In Location', 'Out Location'].map(h => (
                                                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {attendance.map((att) => (
                                            <tr key={att._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 text-sm font-medium text-gray-800">
                                                    {att.date}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[att.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                                                        {STATUS_CONFIG[att.status]?.label || att.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-green-600 font-medium">
                                                    {fmtTime(att.punchIn?.time)}
                                                </td>
                                                <td className="px-5 py-3 text-sm text-red-500 font-medium">
                                                    {fmtTime(att.punchOut?.time)}
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-700">
                                                    {fmtHours(att.hoursWorked)}
                                                </td>
                                                <td className="px-5 py-3 text-sm">
                                                    {att.punchIn?.location?.latitude ? (
                                                        <a
                                                            href={`https://maps.google.com/?q=${att.punchIn.location.latitude},${att.punchIn.location.longitude}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-500 underline text-xs"
                                                        >
                                                            📍 Map
                                                        </a>
                                                    ) : <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-5 py-3 text-sm">
                                                    {att.punchOut?.location?.latitude ? (
                                                        <a
                                                            href={`https://maps.google.com/?q=${att.punchOut.location.latitude},${att.punchOut.location.longitude}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-500 underline text-xs"
                                                        >
                                                            📍 Map
                                                        </a>
                                                    ) : <span className="text-gray-300">—</span>}
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
        </div>
    );
};

export default HrAttendance;