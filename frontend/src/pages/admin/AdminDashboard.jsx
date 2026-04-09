import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROLE_CONFIG = {
  super_admin: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'Super Admin' },
  admin: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Admin' },
  manager: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', label: 'Manager' },
  team_leader: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)', label: 'Team Leader' },
  agent: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Agent' },
  hr: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'HR' },
  finance: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'Finance' },
};

// ── Mini Bar Chart ─────────────────────────────────────────
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          background: color,
          borderRadius: 3,
          opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5,
          minHeight: 4,
        }} />
      ))}
    </div>
  );
};

// ── Donut Chart ────────────────────────────────────────────
const DonutChart = ({ segments, size = 120 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let cumulative = 0;
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.13;

  const paths = segments.map((seg) => {
    const startAngle = (cumulative / total) * 360 - 90;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 360 - 90;
    const large = endAngle - startAngle > 180 ? 1 : 0;
    const toRad = (d) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    return { ...seg, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
  });

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={stroke}
          strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${p.color}40)` }} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#1e293b' }}>
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 10, fill: '#94a3b8' }}>
        Total
      </text>
    </svg>
  );
};

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, gradient, trend, sparkData }) => (
  <div style={{
    background: '#fff',
    borderRadius: 20,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Background accent */}
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 100, height: 100,
      background: gradient,
      borderRadius: '0 20px 0 100%',
      opacity: 0.08,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {icon}
      </div>
      {trend !== undefined && (
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
          background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: trend >= 0 ? '#10B981' : '#EF4444',
        }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: -1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
    {sparkData && <MiniBarChart data={sparkData} color={gradient} />}
  </div>
);

// ── Activity Item ──────────────────────────────────────────
const ActivityItem = ({ user, action, time }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
    }}>
      {user.charAt(0).toUpperCase()}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {user}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{action}</div>
    </div>
    <div style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>{time}</div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export default function AdminDashboard() {
  const { refreshTrigger } = useOutletContext() || {};
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const h = { Authorization: `Bearer ${token}` };
        const [s, r] = await Promise.all([
          fetch(`${API}/admin/stats`, { headers: h }).then(x => x.json()),
          fetch(`${API}/admin/recent-users`, { headers: h }).then(x => x.json()),
        ]);
        setStats(s);
        setRecentUsers(r.users || []);
      } catch { /* show skeleton */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [refreshTrigger]);

  const roleCounts = stats?.roleCounts || {};
  const donutSegments = Object.entries(ROLE_CONFIG)
    .map(([key, cfg]) => ({ label: cfg.label, value: roleCounts[key] || 0, color: cfg.color }))
    .filter(s => s.value > 0);

  const spark = [12, 18, 14, 22, 19, 25, stats?.newUsersThisWeek || 8];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #e2e8f0', borderTopColor: '#3B82F6',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
        }} />
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .admin-card { animation: fadeUp 0.4s ease both; }
        .admin-card:nth-child(2) { animation-delay: 0.05s; }
        .admin-card:nth-child(3) { animation-delay: 0.1s; }
        .admin-card:nth-child(4) { animation-delay: 0.15s; }
        .quick-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .quick-btn { transition: all 0.2s ease; }
        .user-row:hover { background: #f8fafc; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Overview</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="admin-card">
          <StatCard label="Total Users" value={stats?.totalUsers} sub="All registered accounts"
            icon="👥" gradient="linear-gradient(135deg,#3B82F6,#6366F1)"
            trend={12} sparkData={spark} />
        </div>
        <div className="admin-card">
          <StatCard label="Active Users" value={stats?.activeUsers} sub="Currently enabled"
            icon="✅" gradient="linear-gradient(135deg,#10B981,#059669)" trend={8} />
        </div>
        <div className="admin-card">
          <StatCard label="New This Week" value={stats?.newUsersThisWeek} sub="Joined last 7 days"
            icon="🆕" gradient="linear-gradient(135deg,#8B5CF6,#7C3AED)" trend={24} />
        </div>
        <div className="admin-card">
          <StatCard label="Active Today" value={stats?.recentlyActive} sub="Logged in 24hrs"
            icon="🟢" gradient="linear-gradient(135deg,#F59E0B,#F97316)"
            trend={stats?.inactiveUsers > 0 ? -stats.inactiveUsers : 0} />
        </div>
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Role Breakdown */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Users by Role</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DonutChart segments={donutSegments} size={120} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                const count = roleCounts[key] || 0;
                const pct = stats?.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{cfg.label}</span>
                    <div style={{ width: 60, height: 4, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', width: 20, textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '➕', label: 'Add User', color: '#3B82F6', path: '/admin/users' },
              { icon: '👥', label: 'Manage Users', color: '#8B5CF6', path: '/admin/users' },
              { icon: '📊', label: 'Reports', color: '#10B981', path: '/reports' },
              { icon: '⚙️', label: 'Settings', color: '#F59E0B', path: '/admin/settings' },
            ].map((a) => (
              <button key={a.label} className="quick-btn"
                onClick={() => navigate(a.path)}
                style={{
                  background: `${a.color}10`, border: `1.5px solid ${a.color}25`,
                  borderRadius: 14, padding: '16px 12px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: `0 2px 8px ${a.color}15`,
                }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: a.color }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Recent Users */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recently Joined</h2>
            <button onClick={() => navigate('/admin/users')}
              style={{ fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </button>
          </div>
          {recentUsers.length === 0
            ? <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No users yet</p>
            : recentUsers.map(u => (
              <div key={u._id} className="user-row" style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
                borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
              }} onClick={() => navigate('/admin/users')}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${ROLE_CONFIG[u.role]?.color || '#3B82F6'}, #6366F1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: ROLE_CONFIG[u.role]?.bg || '#f1f5f9',
                  color: ROLE_CONFIG[u.role]?.color || '#64748b',
                }}>
                  {ROLE_CONFIG[u.role]?.label || u.role}
                </span>
              </div>
            ))
          }
        </div>

        {/* System Health */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>System Health</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'User Activation Rate', value: stats?.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0, color: '#10B981' },
              { label: 'Daily Login Rate', value: stats?.totalUsers > 0 ? Math.round((stats.recentlyActive / stats.totalUsers) * 100) : 0, color: '#3B82F6' },
              { label: 'New User Growth', value: stats?.totalUsers > 0 ? Math.round((stats.newUsersThisWeek / stats.totalUsers) * 100) : 0, color: '#8B5CF6' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}%</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                  <div style={{
                    width: `${item.value}%`, height: '100%', borderRadius: 4,
                    background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Info tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
            <div style={{ background: '#fef9ec', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#92400e', fontWeight: 500 }}>Inactive Users</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#b45309', marginTop: 2 }}>{stats?.inactiveUsers || 0}</div>
            </div>
            <div style={{ background: '#ecfdf5', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#065f46', fontWeight: 500 }}>Active Today</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 2 }}>{stats?.recentlyActive || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

