import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Leaf, Building, Mail, Lock } from 'lucide-react';

const RegisterCompany = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // const navigate = useNavigate();
    // const { login } = useAuth(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Assuming login uses the same local storage mechanism
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Trigger context re-render or push to admin dashboard
            window.location.href = '/admin-dashboard';

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">

            {/* Visual Workspace Side */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-12 flex-col justify-between items-start relative overflow-hidden">

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-overlay"></div>

                <div className="z-10 flex items-center gap-3">
                    <div className="p-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                        <Leaf className="w-8 h-8 text-indigo-300" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                        EMS <span className="text-indigo-300 font-light">Pro</span>
                    </span>
                </div>

                <div className="z-10 max-w-lg mt-12 mb-auto">
                    <h1 className="text-5xl font-black leading-tight mb-6 tracking-tight">
                        Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">organization.</span>
                    </h1>
                    <p className="text-lg text-indigo-100/90 leading-relaxed font-light mb-8">
                        Create your isolated workspace today. Manage employees, track attendance, and automate payroll with enterprise-grade security and role-based access control.
                    </p>

                    <div className="flex items-center gap-4 text-sm font-medium text-indigo-200">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-900 flex items-center justify-center font-bold text-white">HR</div>
                            <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-indigo-900 flex items-center justify-center font-bold text-white">IT</div>
                            <div className="w-10 h-10 rounded-full bg-teal-500 border-2 border-indigo-900 flex items-center justify-center font-bold text-white">$$</div>
                        </div>
                        <p>Join thousands of growing companies.</p>
                    </div>
                </div>

                <div className="z-10 text-xs font-medium text-indigo-300/60 mt-8">
                    © {new Date().getFullYear()} EMS Pro Cloud. All rights reserved.
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] z-10">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Register Organization</h2>
                        <p className="mt-2 text-gray-500 font-medium">Set up your admin account and workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                <div className="text-red-600 mt-0.5">⚠️</div>
                                <div className="text-sm font-medium text-red-800">{error}</div>
                            </div>
                        )}

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Company / Admin Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-gray-50/50 hover:bg-gray-50"
                                        placeholder="Acme Corp Admin"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Admin Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-gray-50/50 hover:bg-gray-50"
                                        placeholder="admin@acmecorp.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-gray-50/50 hover:bg-gray-50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-gray-50/50 hover:bg-gray-50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed shadow-none' : ''
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Workspace...
                                </div>
                            ) : 'Create Organization Workspace'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                                Sign in deeply
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;
