import { useEffect, useState, useCallback, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROLES = ['agent', 'team_leader', 'manager', 'hr', 'finance', 'admin', 'super_admin', 'employee'];

const ROLE_CONFIG = {
  super_admin: { color: '#8B5CF6', bg: '#EDE9FE', label: 'Super Admin' },
  admin: { color: '#3B82F6', bg: '#DBEAFE', label: 'Admin' },
  manager: { color: '#6366F1', bg: '#E0E7FF', label: 'Manager' },
  team_leader: { color: '#0EA5E9', bg: '#E0F2FE', label: 'Team Leader' },
  agent: { color: '#10B981', bg: '#D1FAE5', label: 'Agent' },
  hr: { color: '#F59E0B', bg: '#FEF3C7', label: 'HR' },
  finance: { color: '#F97316', bg: '#FFEDD5', label: 'Finance' },
  employee: { color: '#14B8A6', bg: '#CCFBF1', label: 'Employee' },
};

const EMPTY = { name: '', email: '', password: '', role: 'agent', phone: '', isActive: true };

// ── Helpers ────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const c = ROLE_CONFIG[role] || { color: '#64748b', bg: '#F1F5F9', label: role };
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
    }}>{c.label}</span>
  );
};

const Avatar = ({ name, role, size = 36 }) => {
  const color = ROLE_CONFIG[role]?.color || '#3B82F6';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}cc, ${color})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
};

const StatusBadge = ({ active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: active ? '#D1FAE5' : '#FEE2E2',
    color: active ? '#059669' : '#DC2626',
  }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#10B981' : '#EF4444' }} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

// ── Modal ──────────────────────────────────────────────────
const Modal = ({ title, subtitle, onClose, children, width = 460 }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  }} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: '#fff', borderRadius: 24, width: '100%', maxWidth: width,
      boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      animation: 'modalIn 0.2s ease',
    }}>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:none; } }`}</style>
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
          {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{
          background: '#f8fafc', border: 'none', borderRadius: 10, width: 32, height: 32,
          cursor: 'pointer', fontSize: 16, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ── Field ──────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: 12, color: '#EF4444' }}>{error}</span>}
  </div>
);

const inputStyle = (err) => ({
  border: `1.5px solid ${err ? '#FCA5A5' : '#E2E8F0'}`,
  borderRadius: 12, padding: '10px 14px', fontSize: 14,
  outline: 'none', background: err ? '#FFF5F5' : '#F8FAFC',
  color: '#1e293b', width: '100%', boxSizing: 'border-box',
  transition: 'border 0.15s',
});

const selectStyle = {
  border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 14px',
  fontSize: 14, outline: 'none', background: '#F8FAFC',
  color: '#1e293b', width: '100%', cursor: 'pointer',
};

// ── Toast ──────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div style={{
    position: 'fixed', top: 24, right: 24, zIndex: 2000,
    padding: '14px 20px', borderRadius: 14,
    background: type === 'error' ? '#FEF2F2' : '#F0FDF4',
    border: `1px solid ${type === 'error' ? '#FCA5A5' : '#BBF7D0'}`,
    color: type === 'error' ? '#DC2626' : '#16A34A',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
    animation: 'toastIn 0.3s ease',
  }}>
    <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }`}</style>
    {type === 'error' ? '❌' : '✅'} {message}
  </div>
);

// ── Btn ────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = 'primary', disabled, style: s = {} }) => {
  const variants = {
    primary: { background: 'linear-gradient(135deg,#3B82F6,#6366F1)', color: '#fff', border: 'none' },
    danger: { background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: '#fff', border: 'none' },
    ghost: { background: '#F8FAFC', color: '#64748b', border: '1.5px solid #E2E8F0' },
    warning: { background: 'linear-gradient(135deg,#F59E0B,#F97316)', color: '#fff', border: 'none' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant],
      padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
      display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      transition: 'opacity 0.15s', ...s,
    }}>{children}</button>
  );
};

// ── MAIN ───────────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const [form, setForm] = useState(EMPTY);
  const [newPwd, setNewPwd] = useState('');
  const [formErr, setFormErr] = useState({});
  const [saving, setSaving] = useState(false);
  const searchTimer = useRef(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async (pg = page, s = search, rf = roleFilter, sf = statusFilter) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: pg, limit: 10 });
      if (s) p.set('search', s);
      if (rf) p.set('role', rf);
      if (sf !== '') p.set('isActive', sf);
      const res = await fetch(`${API}/admin/users?${p}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users);
      setPagination(data.pagination);
      setSelectedUsers([]);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [page, roleFilter, statusFilter]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setPage(1); fetchUsers(1, val); }, 400);
  };

  const validateForm = (isCreate = false) => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (isCreate && form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  // CREATE
  const handleCreate = async () => {
    const e = validateForm(true);
    if (Object.keys(e).length) { setFormErr(e); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/users`, { method: 'POST', headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('User created successfully!');
      setCreateOpen(false); setForm(EMPTY); fetchUsers();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  // UPDATE
  const handleUpdate = async () => {
    const e = validateForm(false);
    if (Object.keys(e).length) { setFormErr(e); return; }
    setSaving(true);
    try {
      const { password, ...body } = form;
      const res = await fetch(`${API}/admin/users/${editUser._id}`, { method: 'PUT', headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('User updated successfully!');
      setEditUser(null); fetchUsers();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  // TOGGLE
  const handleToggle = async (user) => {
    try {
      const res = await fetch(`${API}/admin/users/${user._id}/toggle-status`, { method: 'PATCH', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`User ${data.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // RESET PASSWORD
  const handleReset = async () => {
    if (newPwd.length < 6) { showToast('Min 6 characters', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/users/${resetUser._id}/reset-password`, {
        method: 'PATCH', headers, body: JSON.stringify({ newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Password reset successfully!');
      setResetUser(null); setNewPwd('');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  // DELETE
  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/users/${deleteUser._id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('User deleted');
      setDeleteUser(null); fetchUsers();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, phone: user.phone || '', isActive: user.isActive, password: '' });
    setFormErr({});
    setEditUser(user);
  };

  const toggleSelect = (id) => setSelectedUsers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div style={{ maxWidth: 1200 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .trow:hover td { background: #f8fafc; }
        .icon-btn:hover { background: #f1f5f9 !important; }
        input:focus, select:focus { border-color: #3B82F6 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
      `}</style>

      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Manage Users</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>{pagination.total} total users in the system</p>
        </div>
        <Btn onClick={() => { setForm(EMPTY); setFormErr({}); setCreateOpen(true); }}>
          <span style={{ fontSize: 18 }}>＋</span> Add New User
        </Btn>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => handleSearch(e.target.value)}
            placeholder="Search name or email..."
            style={{ ...inputStyle(false), paddingLeft: 38, margin: 0 }} />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={{ ...selectStyle, width: 160 }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r]?.label || r}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ ...selectStyle, width: 140 }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        {(search || roleFilter || statusFilter) && (
          <Btn variant="ghost" onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setPage(1); fetchUsers(1, '', '', ''); }}>
            Clear ✕
          </Btn>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
            <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>No users found</p>
            <p style={{ color: '#cbd5e1', fontSize: 13 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['User', 'Role', 'Phone', 'Status', 'Last Login', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} className="trow" style={{ borderBottom: '1px solid #f8fafc', animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setViewUser(user)}>
                      <Avatar name={user.name} role={user.role} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><RoleBadge role={user.role} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{user.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge active={user.isActive} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                      {/* View */}
                      <button className="icon-btn" title="View" onClick={() => setViewUser(user)}
                        style={{ background: 'none', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15, transition: 'background 0.15s' }}>
                        👁
                      </button>
                      {/* Edit */}
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(user)}
                        style={{ background: 'none', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15, transition: 'background 0.15s' }}>
                        ✏️
                      </button>
                      {/* Toggle */}
                      <button className="icon-btn" title={user.isActive ? 'Deactivate' : 'Activate'} onClick={() => handleToggle(user)}
                        style={{ background: 'none', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15, transition: 'background 0.15s' }}>
                        {user.isActive ? '🔴' : '🟢'}
                      </button>
                      {/* Reset Pass */}
                      <button className="icon-btn" title="Reset Password" onClick={() => { setResetUser(user); setNewPwd(''); }}
                        style={{ background: 'none', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15, transition: 'background 0.15s' }}>
                        🔑
                      </button>
                      {/* Delete */}
                      <button className="icon-btn" title="Delete" onClick={() => setDeleteUser(user)}
                        style={{ background: 'none', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15, transition: 'background 0.15s' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 14px', fontSize: 13 }}>← Prev</Btn>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: '#cbd5e1', padding: '0 4px' }}>…</span>}
                    <button onClick={() => setPage(p)} style={{
                      width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: p === page ? 'linear-gradient(135deg,#3B82F6,#6366F1)' : '#f8fafc',
                      color: p === page ? '#fff' : '#64748b',
                    }}>{p}</button>
                  </span>
                ))}
              <Btn variant="ghost" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} style={{ padding: '8px 14px', fontSize: 13 }}>Next →</Btn>
            </div>
          </div>
        )}
      </div>

      {/* ── VIEW USER MODAL ── */}
      {viewUser && (
        <Modal title="User Profile" subtitle={viewUser.email} onClose={() => setViewUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 20 }}>
            <Avatar name={viewUser.name} role={viewUser.role} size={64} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{viewUser.name}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{viewUser.email}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <RoleBadge role={viewUser.role} />
              <StatusBadge active={viewUser.isActive} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Phone', value: viewUser.phone || '—' },
              { label: 'User ID', value: viewUser._id.slice(-8) },
              { label: 'Last Login', value: viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString('en-IN') : 'Never' },
              { label: 'Joined', value: new Date(viewUser.createdAt).toLocaleDateString('en-IN') },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => { setViewUser(null); openEdit(viewUser); }} style={{ flex: 1, justifyContent: 'center' }}>✏️ Edit</Btn>
            <Btn variant="ghost" onClick={() => setViewUser(null)} style={{ flex: 1, justifyContent: 'center' }}>Close</Btn>
          </div>
        </Modal>
      )}

      {/* ── CREATE MODAL ── */}
      {createOpen && (
        <Modal title="Add New User" subtitle="Fill in the details to create a new account" onClose={() => setCreateOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Full Name *" error={formErr.name}>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" style={inputStyle(formErr.name)} />
            </Field>
            <Field label="Email Address *" error={formErr.email}>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" style={inputStyle(formErr.email)} />
            </Field>
            <Field label="Password *" error={formErr.password}>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" style={inputStyle(formErr.password)} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={inputStyle(false)} />
            </Field>
            <Field label="Role">
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={selectStyle}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r]?.label || r}</option>)}
              </select>
            </Field>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setCreateOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn onClick={handleCreate} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? '⏳ Creating...' : '✅ Create User'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── EDIT MODAL ── */}
      {editUser && (
        <Modal title="Edit User" subtitle={`Editing: ${editUser.email}`} onClose={() => setEditUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Full Name" error={formErr.name}>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle(formErr.name)} />
            </Field>
            <Field label="Email" error={formErr.email}>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle(formErr.email)} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle(false)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Role">
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={selectStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r]?.label || r}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={String(form.isActive)} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })} style={selectStyle}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setEditUser(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn onClick={handleUpdate} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── RESET PASSWORD MODAL ── */}
      {resetUser && (
        <Modal title="Reset Password" subtitle={`For: ${resetUser.name} (${resetUser.email})`} onClose={() => setResetUser(null)} width={400}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFF8E7', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#92400E' }}>
              ⚠️ This will immediately change the user's password.
            </div>
            <Field label="New Password">
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min 6 characters" style={inputStyle(false)} />
            </Field>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => setResetUser(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn variant="warning" onClick={handleReset} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? '⏳' : '🔑 Reset Password'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteUser && (
        <Modal title="Delete User" onClose={() => setDeleteUser(null)} width={400}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🗑️</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Delete "{deleteUser.name}"?</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>This action cannot be undone. All data associated with this account will be permanently removed.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <Btn variant="ghost" onClick={() => setDeleteUser(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn variant="danger" onClick={handleDelete} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? '⏳' : '🗑️ Delete User'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
