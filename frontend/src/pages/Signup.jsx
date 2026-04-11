// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         phone: '',
//         password: '',
//         confirmPassword: '',
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');

//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match!');
//             return;
//         }
//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters!');
//             return;
//         }

//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//             alert('Account Created Successfully! 🎉 Please login.');
//             navigate('/');
//         }, 1500);
//     };

//     return (
//         <div className="min-h-screen bg-white flex">

//             {/* Left Side - Blue Panel */}
//             <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 relative overflow-hidden">

//                 {/* Background circles */}
//                 <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-blue-500 rounded-full opacity-40"></div>
//                 <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-blue-700 rounded-full opacity-40"></div>

//                 {/* Content */}
//                 <div className="relative z-10 text-center text-white">
//                     {/* Logo */}
//                     <div className="flex items-center justify-center gap-3 mb-8">
//                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
//                             <span className="text-3xl">📞</span>
//                         </div>
//                         <h1 className="text-5xl font-bold">Callyzer</h1>
//                     </div>

//                     <p className="text-blue-100 text-xl font-medium mb-12">
//                         Advanced Call Analytics & Tracking
//                     </p>

//                     {/* Feature list */}
//                     <div className="space-y-4 text-left">
//                         {[
//                             { icon: '📊', text: 'Real-time Call Analytics' },
//                             { icon: '👥', text: 'Team Performance Tracking' },
//                             { icon: '🎯', text: 'Lead Management System' },
//                             { icon: '📈', text: 'Insightful Reports & Insights' },
//                         ].map((item, i) => (
//                             <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl px-5 py-3 backdrop-blur">
//                                 <span className="text-2xl">{item.icon}</span>
//                                 <span className="text-white font-medium">{item.text}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side - Signup Form */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
//                 <div className="w-full max-w-md">

//                     {/* Mobile Logo */}
//                     <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
//                         <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
//                             <span className="text-2xl">📞</span>
//                         </div>
//                         <h1 className="text-3xl font-bold text-blue-600">Callyzer</h1>
//                     </div>

//                     {/* Heading */}
//                     <div className="mb-8">
//                         <h2 className="text-3xl font-bold text-gray-800">Create Account 🚀</h2>
//                         <p className="text-gray-500 mt-2">Sign up to get started with Callyzer</p>
//                     </div>

//                     {/* Error Box */}
//                     {error && (
//                         <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
//                             <span className="text-red-500 text-xl">⚠️</span>
//                             <span className="text-red-600 text-sm">{error}</span>
//                         </div>
//                     )}

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-5">

//                         {/* Full Name */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Full Name <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
//                                     👤
//                                 </span>
//                                 <input
//                                     type="text"
//                                     name="fullName"
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     placeholder="Enter Your Full Name"
//                                     required
//                                     className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Email Address <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
//                                     ✉️
//                                 </span>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter Your Email Address"
//                                     required
//                                     className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         {/* Phone */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Phone Number <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
//                                     📱
//                                 </span>
//                                 <input
//                                     type="tel"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     placeholder="Enter Your Phone Number"
//                                     required
//                                     className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Password <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
//                                     🔒
//                                 </span>
//                                 <input
//                                     type={showPassword ? 'text' : 'password'}
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Enter Your Password"
//                                     required
//                                     className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
//                                 >
//                                     {showPassword ? '🙈' : '👁️'}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Confirm Password */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Confirm Password <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
//                                     🔐
//                                 </span>
//                                 <input
//                                     type={showConfirm ? 'text' : 'password'}
//                                     name="confirmPassword"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     placeholder="Confirm Your Password"
//                                     required
//                                     className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirm(!showConfirm)}
//                                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
//                                 >
//                                     {showConfirm ? '🙈' : '👁️'}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Terms */}
//                         <div className="flex items-start gap-2">
//                             <input
//                                 type="checkbox"
//                                 required
//                                 className="w-4 h-4 mt-1 accent-blue-600 rounded"
//                             />
//                             <span className="text-sm text-gray-600">
//                                 I agree to the{' '}
//                                 <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a>
//                                 {' '}and{' '}
//                                 <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
//                             </span>
//                         </div>

//                         {/* Signup Button */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide"
//                         >
//                             {loading ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Creating Account...
//                                 </span>
//                             ) : (
//                                 'CREATE ACCOUNT →'
//                             )}
//                         </button>

//                         {/* Divider */}
//                         <div className="flex items-center gap-3">
//                             <div className="flex-1 h-px bg-gray-200"></div>
//                             <span className="text-gray-400 text-sm font-medium">OR</span>
//                             <div className="flex-1 h-px bg-gray-200"></div>
//                         </div>

//                         {/* Google Button */}
//                         <button
//                             type="button"
//                             className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-400 bg-white py-3.5 rounded-xl transition-all duration-200 hover:shadow-md font-semibold text-gray-700"
//                         >
//                             <svg className="w-5 h-5" viewBox="0 0 24 24">
//                                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                             </svg>
//                             Sign Up with Google
//                         </button>
//                     </form>

//                     {/* Login Link */}
//                     <p className="text-center text-sm text-gray-500 mt-6">
//                         Already have an account?{' '}
//                         <button
//                             onClick={() => navigate('/login')}
//                             className="text-blue-600 font-bold hover:underline"
//                         >
//                             Sign In →
//                         </button>
//                     </p>

//                 </div>
//             </div>
//         </div >
//     );
// };

// export default Signup;


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Password strength
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { level: 0, label: '', color: '' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
        if (score === 2) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
        if (score === 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
        return { level: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const strength = getPasswordStrength(formData.password);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (apiError) setApiError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setLoading(true);
        setApiError('');
        setApiSuccess('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
            setApiSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const InputIcon = ({ error, children }) => (
        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none`}>
            <span className={error ? 'text-red-400' : 'text-gray-400'}>{children}</span>
        </div>
    );

    const inputClass = (field) =>
        `w-full pl-11 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 outline-none ${errors[field] ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100'}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Callyzer</h1>
                    <p className="text-gray-500 text-sm mt-1">AI-Powered Call Analytics Platform</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-1">Join Callyzer and start analyzing your calls</p>
                    </div>

                    {/* Success Alert */}
                    {apiSuccess && (
                        <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{apiSuccess}</span>
                        </div>
                    )}

                    {/* Error Alert */}
                    {apiError && (
                        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <InputIcon error={errors.name}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </InputIcon>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Rahul Sharma"
                                    className={inputClass('name')} />
                            </div>
                            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <InputIcon error={errors.email}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </InputIcon>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                                    className={inputClass('email')} />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <InputIcon error={errors.password}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </InputIcon>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                                    className={`${inputClass('password')} pr-11`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                                    {showPassword
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {/* Password Strength Bar */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${strength.level <= 1 ? 'text-red-600' : strength.level === 2 ? 'text-yellow-600' : strength.level === 3 ? 'text-blue-600' : 'text-green-600'}`}>
                                        Password Strength: {strength.label}
                                    </p>
                                </div>
                            )}
                            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <InputIcon error={errors.confirmPassword}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </InputIcon>
                                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password"
                                    className={`${inputClass('confirmPassword')} pr-11`} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                                    {showConfirm
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2">
                            {loading ? (
                                <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating Account...</>
                            ) : (
                                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400 font-medium">Already have an account?</span></div>
                    </div>

                    <Link to="/login" className="w-full py-3 px-4 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Sign In Instead
                    </Link>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By signing up, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
