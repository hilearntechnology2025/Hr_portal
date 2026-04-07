// import { useEffect, useState } from 'react';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const HrProfile = () => {
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

//     const [hr, setHr] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [msg, setMsg] = useState({ text: '', type: '' });

//     const showMsg = (text, type = 'success') => {
//         setMsg({ text, type });
//         setTimeout(() => setMsg({ text: '', type: '' }), 3500);
//     };

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const res = await fetch(`${API}/hr/profile`, { headers });
//                 const data = await res.json();
//                 setHr(data.hr);
//                 setName(data.hr.name);
//                 setPhone(data.hr.phone || '');
//             } catch {
//                 showMsg('Profile load nahi hua', 'error');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProfile();
//     }, []);

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         try {
//             const res = await fetch(`${API}/hr/profile`, {
//                 method: 'PUT',
//                 headers,
//                 body: JSON.stringify({ name, phone }),
//             });
//             const data = await res.json();
//             if (!res.ok) { showMsg(data.message, 'error'); return; }
//             setHr(data.hr);
//             localStorage.setItem('userName', data.hr.name);
//             showMsg('Profile update ho gaya! ✅');
//         } catch {
//             showMsg('Kuch galat ho gaya', 'error');
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) return (
//         <div className="flex items-center justify-center h-64">
//             <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     return (
//         <div className="max-w-2xl mx-auto space-y-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
//                 <p className="text-gray-500 text-sm mt-1">Apni profile update karo</p>
//             </div>

//             {msg.text && (
//                 <div className={`p-4 rounded-xl text-sm font-medium ${msg.type === 'error'
//                         ? 'bg-red-50 border border-red-200 text-red-700'
//                         : 'bg-green-50 border border-green-200 text-green-700'
//                     }`}>
//                     {msg.text}
//                 </div>
//             )}

//             {/* Avatar & Info */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-5 mb-6">
//                     <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-2xl">
//                         {hr?.name?.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                         <p className="text-xl font-bold text-gray-800">{hr?.name}</p>
//                         <p className="text-gray-500 text-sm">{hr?.email}</p>
//                         <span className="mt-1 inline-block text-xs px-2.5 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
//                             {hr?.role}
//                         </span>
//                     </div>
//                 </div>

//                 <div className="border-t border-gray-100 pt-6">
//                     <p className="text-sm font-bold text-gray-700 mb-4">Account Information</p>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-400 text-xs mb-1">Email</p>
//                             <p className="text-gray-800 font-medium">{hr?.email}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-400 text-xs mb-1">Role</p>
//                             <p className="text-gray-800 font-medium capitalize">{hr?.role}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-400 text-xs mb-1">Status</p>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hr?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
//                                 {hr?.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                         </div>
//                         <div>
//                             <p className="text-gray-400 text-xs mb-1">Member Since</p>
//                             <p className="text-gray-800 font-medium">
//                                 {hr?.createdAt ? new Date(hr.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Profile */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <p className="text-base font-bold text-gray-800 mb-5">Edit Profile</p>
//                 <form onSubmit={handleSave} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                         <input
//                             type="text"
//                             value={name}
//                             onChange={e => setName(e.target.value)}
//                             className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
//                             placeholder="Your name"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                         <input
//                             type="text"
//                             value={phone}
//                             onChange={e => setPhone(e.target.value)}
//                             className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
//                             placeholder="Phone number"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                         <input
//                             type="email"
//                             value={hr?.email || ''}
//                             disabled
//                             className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
//                         />
//                         <p className="text-xs text-gray-400 mt-1">Email change karne ke liye admin se contact karo</p>
//                     </div>
//                     <button
//                         type="submit"
//                         disabled={saving}
//                         className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
//                     >
//                         {saving ? 'Saving...' : 'Save Changes'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default HrProfile;


import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HrProfile = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const [hr, setHr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });

    const showMsg = (text, type = 'success') => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3500);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API}/hr/profile`, { headers });
                const data = await res.json();
                setHr(data.hr);
                setName(data.hr.name);
                setPhone(data.hr.phone || '');
            } catch {
                showMsg('Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API}/hr/profile`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ name, phone }),
            });
            const data = await res.json();
            if (!res.ok) { showMsg(data.message, 'error'); return; }
            setHr(data.hr);
            localStorage.setItem('userName', data.hr.name);
            showMsg('Profile updated successfully! ✅');
        } catch {
            showMsg('Something went wrong. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Update your profile information</p>
            </div>

            {msg.text && (
                <div className={`p-4 rounded-xl text-sm font-medium ${msg.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                    {msg.text}
                </div>
            )}

            {/* Avatar & Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-2xl">
                        {hr?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-800">{hr?.name}</p>
                        <p className="text-gray-500 text-sm">{hr?.email}</p>
                        <span className="mt-1 inline-block text-xs px-2.5 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
                            {hr?.role}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm font-bold text-gray-700 mb-4">Account Information</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Email</p>
                            <p className="text-gray-800 font-medium">{hr?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Role</p>
                            <p className="text-gray-800 font-medium capitalize">{hr?.role}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Status</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hr?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {hr?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Member Since</p>
                            <p className="text-gray-800 font-medium">
                                {hr?.createdAt ? new Date(hr.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-base font-bold text-gray-800 mb-5">Edit Profile</p>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                            placeholder="Phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={hr?.email || ''}
                            disabled
                            className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Contact admin to change your email address</p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HrProfile;