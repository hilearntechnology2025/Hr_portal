

import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROLE_COLORS = {
    agent: 'bg-green-100 text-green-700',
    team_leader: 'bg-cyan-100 text-cyan-700',
    manager: 'bg-indigo-100 text-indigo-700',
};

const EMP_TYPES = ['full_time', 'part_time', 'contract', 'intern'];

// ── Reusable Components ────────────────────────────────────────
const Badge = ({ children, color = 'gray' }) => {
    const colors = {
        green: 'bg-green-100 text-green-700',
        cyan: 'bg-cyan-100 text-cyan-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        gray: 'bg-gray-100 text-gray-600',
        red: 'bg-red-100 text-red-600',
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[color]}`}>
            {children}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
};

const Field = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
        />
    </div>
);

// ── HR Record Edit Form ────────────────────────────────────────
const HrRecordForm = ({ employee, hrRecord, onSave, onClose }) => {
    const [form, setForm] = useState({
        department: hrRecord?.department || '',
        designation: hrRecord?.designation || '',
        joiningDate: hrRecord?.joiningDate ? hrRecord.joiningDate.slice(0, 10) : '',
        employmentType: hrRecord?.employmentType || 'full_time',
        salary: {
            basic: hrRecord?.salary?.basic || 0,
            hra: hrRecord?.salary?.hra || 0,
            allowance: hrRecord?.salary?.allowance || 0,
            deduction: hrRecord?.salary?.deduction || 0,
        },
        leaveBalance: {
            sick: hrRecord?.leaveBalance?.sick ?? 12,
            casual: hrRecord?.leaveBalance?.casual ?? 12,
            earned: hrRecord?.leaveBalance?.earned ?? 15,
        },
        emergencyContact: {
            name: hrRecord?.emergencyContact?.name || '',
            relation: hrRecord?.emergencyContact?.relation || '',
            phone: hrRecord?.emergencyContact?.phone || '',
        },
        notes: hrRecord?.notes || '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const totalSalary = Number(form.salary.basic) + Number(form.salary.hra) +
        Number(form.salary.allowance) - Number(form.salary.deduction);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`${API}/hr/employees/${employee._id}/hr-record`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }
            onSave();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
            )}

            {/* Employee Info (read-only) */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                    {employee.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.email} &bull; <span className={`text-xs font-medium ${ROLE_COLORS[employee.role] || ''}`}>{employee.role}</span></p>
                </div>
            </div>

            {/* Employment Details */}
            <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Employment Details</p>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Department" value={form.department} onChange={(v) => setForm(f => ({ ...f, department: v }))} placeholder="e.g. Sales" />
                    <Field label="Designation" value={form.designation} onChange={(v) => setForm(f => ({ ...f, designation: v }))} placeholder="e.g. Senior Agent" />
                    <Field label="Joining Date" type="date" value={form.joiningDate} onChange={(v) => setForm(f => ({ ...f, joiningDate: v }))} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select
                            value={form.employmentType}
                            onChange={(e) => setForm(f => ({ ...f, employmentType: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                        >
                            {EMP_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Salary */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-700">Salary (₹/month)</p>
                    <span className="text-sm font-bold text-green-600">Total: ₹{totalSalary.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {['basic', 'hra', 'allowance', 'deduction'].map((key) => (
                        <Field
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            type="number"
                            value={form.salary[key]}
                            onChange={(v) => setForm(f => ({ ...f, salary: { ...f.salary, [key]: v } }))}
                        />
                    ))}
                </div>
            </div>

            {/* Leave Balance */}
            <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Leave Balance (days)</p>
                <div className="grid grid-cols-3 gap-4">
                    {['sick', 'casual', 'earned'].map((key) => (
                        <Field
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            type="number"
                            value={form.leaveBalance[key]}
                            onChange={(v) => setForm(f => ({ ...f, leaveBalance: { ...f.leaveBalance, [key]: v } }))}
                        />
                    ))}
                </div>
            </div>

            {/* Emergency Contact */}
            <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Emergency Contact</p>
                <div className="grid grid-cols-3 gap-4">
                    <Field label="Name" value={form.emergencyContact.name} onChange={(v) => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, name: v } }))} />
                    <Field label="Relation" value={form.emergencyContact.relation} onChange={(v) => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, relation: v } }))} />
                    <Field label="Phone" value={form.emergencyContact.phone} onChange={(v) => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, phone: v } }))} />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                    placeholder="Additional notes..."
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                    {saving ? 'Saving...' : 'Save HR Record'}
                </button>
                <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────
const HrEmployees = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);

    const [editEmployee, setEditEmployee] = useState(null);
    const [editHrRecord, setEditHrRecord] = useState(null);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.set('search', search);
            if (filterRole) params.set('role', filterRole);
            if (filterStatus) params.set('isActive', filterStatus);

            const res = await fetch(`${API}/hr/employees?${params}`, { headers });
            const data = await res.json();
            setEmployees(data.employees || []);
            setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
        } catch {
            showToast('❌ Failed to load employees');
        } finally {
            setLoading(false);
        }
    }, [page, search, filterRole, filterStatus]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const openEdit = (emp) => {
        setEditEmployee(emp);
        setEditHrRecord(emp.hrRecord);
    };

    const handleSaved = () => {
        setEditEmployee(null);
        setEditHrRecord(null);
        showToast('✅ HR record updated successfully');
        fetchEmployees();
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
                <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
                <p className="text-gray-500 text-sm mt-1">All employees — view & manage HR records</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                >
                    <option value="">All Roles</option>
                    <option value="agent">Agent</option>
                    <option value="team_leader">Team Leader</option>
                    <option value="manager">Manager</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <button
                    onClick={() => { setSearch(''); setFilterRole(''); setFilterStatus(''); setPage(1); }}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Total count */}
            <p className="text-sm text-gray-500">
                Total <span className="font-semibold text-gray-800">{pagination.total}</span> employees
            </p>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-sm">No employees found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {['Employee', 'Role', 'Department', 'Designation', 'Salary', 'Status', 'Action'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {employees.map((emp) => {
                                    const hr = emp.hrRecord;
                                    const total = hr
                                        ? (hr.salary?.basic || 0) + (hr.salary?.hra || 0) +
                                        (hr.salary?.allowance || 0) - (hr.salary?.deduction || 0)
                                        : 0;
                                    return (
                                        <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
                                                        <p className="text-xs text-gray-400">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge color={emp.role === 'agent' ? 'green' : emp.role === 'team_leader' ? 'cyan' : 'indigo'}>
                                                    {emp.role}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{hr?.department || '—'}</td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{hr?.designation || '—'}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                                {total > 0 ? `₹${total.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {emp.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => openEdit(emp)}
                                                    className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium"
                                                >
                                                    Edit HR Record
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

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        ← Prev
                    </button>
                    <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Edit HR Record Modal */}
            <Modal isOpen={!!editEmployee} onClose={() => setEditEmployee(null)} title="Edit HR Record">
                {editEmployee && (
                    <HrRecordForm
                        employee={editEmployee}
                        hrRecord={editHrRecord}
                        onSave={handleSaved}
                        onClose={() => setEditEmployee(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default HrEmployees;