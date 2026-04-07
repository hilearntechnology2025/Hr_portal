import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManagerProfile = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingPwd, setSavingPwd] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

    const showMsg = (setter, text, type = 'success') => {
        setter({ text, type });
        setTimeout(() => setter({ text: '', type: '' }), 3500);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API}/manager/profile`, { headers });
                const data = await res.json();
                setManager(data.manager);
                setName(data.manager.name);
                setPhone(data.manager.phone || '');
            } catch {
                showMsg(setProfileMsg, 'Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API}/manager/profile`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ name, phone }),
            });
            const data = await res.json();
            if (!res.ok) { showMsg(setProfileMsg, data.message, 'error'); return; }
            setManager(data.manager);
            localStorage.setItem('userName', data.manager.name);
            showMsg(setProfileMsg, 'Profile updated successfully! ✅');
        } catch {
            showMsg(setProfileMsg, 'Something went wrong', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showMsg(setPwdMsg, 'New password and confirm password do not match', 'error');
            return;
        }
        setSavingPwd(true);
        try {
            const res = await fetch(`${API}/auth/change-password`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { showMsg(setPwdMsg, data.message, 'error'); return; }
            showMsg(setPwdMsg, 'Password changed successfully! ✅');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            showMsg(setPwdMsg, 'Something went wrong', 'error');
        } finally {
            setSavingPwd(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const MsgBox = ({ msg }) =>
        msg.text ? (
            <div className={`rounded-xl px-4 py-3 text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                {msg.text}
            </div>
        ) : null;

    const InputField = ({ label, type = 'text', value, onChange, placeholder, disabled }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-50 disabled:text-gray-400 transition-all"
            />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Update your personal information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {manager?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-800">{manager?.name}</p>
                        <p className="text-gray-500 text-sm">{manager?.email}</p>
                        <span className="inline-block mt-1 text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                            👔 Manager
                        </span>
                    </div>
                </div>

                {/* Info Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <h3 className="text-base font-bold text-gray-700 mb-3">Personal Information</h3>

                    <MsgBox msg={profileMsg} />

                    <InputField
                        label="Full Name"
                        value={name}
                        onChange={setName}
                        placeholder="Enter your name"
                    />
                    <InputField
                        label="Email (Cannot be changed)"
                        value={manager?.email || ''}
                        onChange={() => { }}
                        disabled={true}
                    />
                    <InputField
                        label="Phone Number"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+91 XXXXXXXXXX"
                    />

                    <div className="pt-1">
                        <p className="text-xs text-gray-400 mb-3">
                            Account created on: {new Date(manager?.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'long', year: 'numeric',
                            })}
                        </p>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            {saving ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                            ) : '💾 Save Profile'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-700 mb-4">🔐 Change Password</h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <MsgBox msg={pwdMsg} />

                    <InputField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        placeholder="Old password"
                    />
                    <InputField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Minimum 6 characters"
                    />
                    <InputField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Re-enter new password"
                    />

                    <button
                        type="submit"
                        disabled={savingPwd}
                        className="w-full py-2.5 bg-gray-800 text-white rounded-xl font-medium text-sm hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                        {savingPwd ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Changing...</>
                        ) : '🔑 Change Password'}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default ManagerProfile;