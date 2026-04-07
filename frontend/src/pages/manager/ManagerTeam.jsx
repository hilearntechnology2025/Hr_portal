import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Reusable Badge ───────────────────────────────────────────
const Badge = ({ children, color }) => {
    const colors = {
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-600',
        cyan: 'bg-cyan-100 text-cyan-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        gray: 'bg-gray-100 text-gray-600',
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
};

// ─── Modal ────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

// ─── Input Field ──────────────────────────────────────────────
const Field = ({ label, type = 'text', value, onChange, placeholder, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
        />
    </div>
);

// ─── Main Component ───────────────────────────────────────────
const ManagerTeam = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const [members, setMembers] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [toast, setToast] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);

    // Modals
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showResetPwd, setShowResetPwd] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // Form states
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent', phone: '' });
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '', phone: '' });
    const [newPassword, setNewPassword] = useState('');
    const [formError, setFormError] = useState('');

    // ── Fetch members ────────────────────────────────────────────
    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.append('search', search);
            if (filterRole) params.append('role', filterRole);
            if (filterStatus !== '') params.append('isActive', filterStatus);

            const res = await fetch(`${API}/manager/team?${params}`, { headers });
            const data = await res.json();
            setMembers(data.members || []);
            setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
        } catch {
            showToast('Failed to load members', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, search, filterRole, filterStatus]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Search debounce
    useEffect(() => {
        setPage(1);
    }, [search, filterRole, filterStatus]);

    // ── Toast helper ─────────────────────────────────────────────
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Add Member ───────────────────────────────────────────────
    const handleAddMember = async (e) => {
        e.preventDefault();
        setFormError('');
        setActionLoading('add');
        try {
            const res = await fetch(`${API}/manager/team`, {
                method: 'POST',
                headers,
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.message); return; }
            showToast('Member added successfully! ✅');
            setShowAdd(false);
            setForm({ name: '', email: '', password: '', role: 'agent', phone: '' });
            fetchMembers();
        } catch {
            setFormError('Something went wrong, please try again');
        } finally {
            setActionLoading('');
        }
    };

    // ── Edit Member ──────────────────────────────────────────────
    const openEdit = (member) => {
        setSelectedMember(member);
        setEditForm({ name: member.name, email: member.email, role: member.role, phone: member.phone || '' });
        setFormError('');
        setShowEdit(true);
    };

    const handleEditMember = async (e) => {
        e.preventDefault();
        setFormError('');
        setActionLoading('edit');
        try {
            const res = await fetch(`${API}/manager/team/${selectedMember._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.message); return; }
            showToast('Member updated! ✅');
            setShowEdit(false);
            fetchMembers();
        } catch {
            setFormError('Something went wrong');
        } finally {
            setActionLoading('');
        }
    };

    // ── Toggle Status ────────────────────────────────────────────
    const handleToggleStatus = async (member) => {
        setActionLoading(`toggle-${member._id}`);
        try {
            const res = await fetch(`${API}/manager/team/${member._id}/toggle-status`, {
                method: 'PATCH',
                headers,
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.message, 'error'); return; }
            showToast(data.message);
            fetchMembers();
        } catch {
            showToast('Failed to change status', 'error');
        } finally {
            setActionLoading('');
        }
    };

    // ── Reset Password ───────────────────────────────────────────
    const openResetPwd = (member) => {
        setSelectedMember(member);
        setNewPassword('');
        setFormError('');
        setShowResetPwd(true);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setFormError('');
        setActionLoading('reset');
        try {
            const res = await fetch(`${API}/manager/team/${selectedMember._id}/reset-password`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.message); return; }
            showToast('Password reset successfully! ✅');
            setShowResetPwd(false);
        } catch {
            setFormError('Something went wrong');
        } finally {
            setActionLoading('');
        }
    };

    // ─────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your team's agents and team leaders
                    </p>
                </div>
                <button
                    onClick={() => { setShowAdd(true); setFormError(''); }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Member
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">All Roles</option>
                        <option value="agent">Agent</option>
                        <option value="team_leader">Team Leader</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Members', value: pagination.total, color: 'text-indigo-600' },
                    { label: 'On This Page', value: members.length, color: 'text-gray-700' },
                    { label: 'Total Pages', value: pagination.pages, color: 'text-gray-700' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-5xl mb-3">👥</p>
                        <p className="font-semibold text-gray-600">No members found</p>
                        <p className="text-sm mt-1">Change the filter or add a new member</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {['Member', 'Role', 'Phone', 'Status', 'Join Date', 'Actions'].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Member */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <Badge color={member.role === 'team_leader' ? 'cyan' : 'indigo'}>
                                                {member.role === 'team_leader' ? '⭐ Team Leader' : '🎧 Agent'}
                                            </Badge>
                                        </td>
                                        {/* Phone */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {member.phone || <span className="text-gray-300">—</span>}
                                        </td>
                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <Badge color={member.isActive ? 'green' : 'red'}>
                                                {member.isActive ? '● Active' : '● Inactive'}
                                            </Badge>
                                        </td>
                                        {/* Join Date */}
                                        <td className="px-5 py-4 text-gray-500 text-xs">
                                            {new Date(member.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => openEdit(member)}
                                                    title="Edit"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {/* Toggle Status */}
                                                <button
                                                    onClick={() => handleToggleStatus(member)}
                                                    disabled={actionLoading === `toggle-${member._id}`}
                                                    title={member.isActive ? 'Deactivate' : 'Activate'}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${member.isActive
                                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {actionLoading === `toggle-${member._id}` ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : member.isActive ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 715.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                {/* Reset Password */}
                                                <button
                                                    onClick={() => openResetPwd(member)}
                                                    title="Reset Password"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                ← Previous
                            </button>
                            <button
                                disabled={page === pagination.pages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── ADD MEMBER MODAL ──────────────────────────────────── */}
            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Team Member">
                <form onSubmit={handleAddMember} className="space-y-4">
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                            {formError}
                        </div>
                    )}
                    <Field
                        label="Name" value={form.name} required
                        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                        placeholder="Enter full name"
                    />
                    <Field
                        label="Email" type="email" value={form.email} required
                        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                        placeholder="email@example.com"
                    />
                    <Field
                        label="Password" type="password" value={form.password} required
                        onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                        placeholder="Minimum 6 characters"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="agent">🎧 Agent</option>
                            <option value="team_leader">⭐ Team Leader</option>
                        </select>
                    </div>
                    <Field
                        label="Phone (optional)" value={form.phone}
                        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                        placeholder="+91 XXXXXXXXXX"
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowAdd(false)}
                            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={actionLoading === 'add'}
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            {actionLoading === 'add' ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
                            ) : 'Add Member'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── EDIT MEMBER MODAL ─────────────────────────────────── */}
            <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Member">
                <form onSubmit={handleEditMember} className="space-y-4">
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                            {formError}
                        </div>
                    )}
                    <Field
                        label="Name" value={editForm.name} required
                        onChange={(v) => setEditForm((f) => ({ ...f, name: v }))}
                    />
                    <Field
                        label="Email" type="email" value={editForm.email} required
                        onChange={(v) => setEditForm((f) => ({ ...f, email: v }))}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                        <select
                            value={editForm.role}
                            onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="agent">🎧 Agent</option>
                            <option value="team_leader">⭐ Team Leader</option>
                        </select>
                    </div>
                    <Field
                        label="Phone" value={editForm.phone}
                        onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                        placeholder="+91 XXXXXXXXXX"
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowEdit(false)}
                            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={actionLoading === 'edit'}
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            {actionLoading === 'edit' ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── RESET PASSWORD MODAL ──────────────────────────────── */}
            <Modal isOpen={showResetPwd} onClose={() => setShowResetPwd(false)} title="Reset Password">
                {selectedMember && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-xl">
                        <p className="text-sm text-indigo-700 font-medium">{selectedMember.name}</p>
                        <p className="text-xs text-indigo-500">{selectedMember.email}</p>
                    </div>
                )}
                <form onSubmit={handleResetPassword} className="space-y-4">
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                            {formError}
                        </div>
                    )}
                    <Field
                        label="New Password" type="password" value={newPassword} required
                        onChange={setNewPassword}
                        placeholder="Minimum 6 characters"
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowResetPwd(false)}
                            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={actionLoading === 'reset'}
                            className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2">
                            {actionLoading === 'reset' ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</>
                            ) : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default ManagerTeam;