import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        currency: 'XAF'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.currency
            );

            if (response.data.success) {
                toast.success('Account created successfully!');
                navigate('/signin', {
                    state: { message: 'Account created! Please sign in.' }
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-bg-primary dark:bg-neutral-900">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bg-secondary to-primary-light dark:from-neutral-800 dark:to-neutral-700 p-12 items-center justify-center relative overflow-hidden">
                <div className="max-w-md z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-kombu to-primary-moss rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="bi bi-tree-fill text-3xl text-white"></i>
                        </div>
                        <span className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">FinanceTracker</span>
                    </div>
                    <h1 className="text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                        Start Your Financial Journey Today
                    </h1>
                    <p className="text-lg text-text-secondary dark:text-text-muted font-light">
                        Join thousands managing their finances smartly
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-accent-sage dark:bg-primary-moss rounded-full opacity-20 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-moss dark:bg-accent-sage rounded-full opacity-20 blur-3xl" style={{ animation: 'float 3s ease-in-out infinite 1s' }}></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                        <i className="bi bi-tree-fill text-3xl text-primary-kombu dark:text-primary-light"></i>
                        <span className="text-2xl font-serif font-medium text-text-primary dark:text-neutral-100">FinanceTracker</span>
                    </div>

                    <div className="flex justify-end mb-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-800 transition-all duration-300"
                            aria-label="Toggle dark mode"
                        >
                            <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                        </button>
                    </div>

                    <div className="bg-bg-card dark:bg-neutral-800 rounded-2xl shadow-xl p-8" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <div className="mb-8">
                            <h2 className="text-3xl font-serif font-medium text-text-primary dark:text-neutral-100 mb-2">Sign Up</h2>
                            <p className="text-text-secondary dark:text-neutral-400 font-light">Create your free account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <i className="bi bi-person absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        placeholder="Kim Namjoon"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        placeholder="your.email@example.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">Password</label>
                                <div className="relative">
                                    <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-12 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                        minLength="8"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400 hover:text-text-secondary dark:hover:text-neutral-300 transition-colors duration-300"
                                    >
                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                                <p className="text-xs text-text-muted dark:text-neutral-500 mt-1 font-light">At least 8 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">Currency</label>
                                <div className="relative">
                                    <i className="bi bi-cash absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        disabled={loading}
                                    >
                                        <option value="XAF">XAF - Central African CFA Franc</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="NGN">NGN - Nigerian Naira</option>
                                        <option value="ZAR">ZAR - South African Rand</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-accent-cafe dark:hover:bg-primary-dark transition-all duration-400 disabled:opacity-50 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-person-plus"></i>
                                        <span>Create Account</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-text-secondary dark:text-neutral-400 font-light">
                                Already have an account?{' '}
                                <Link
                                    to="/signin"
                                    className="text-primary-moss dark:text-primary-light hover:text-primary-kombu dark:hover:text-primary-moss font-medium transition-colors duration-300"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="text-sm text-text-muted dark:text-neutral-500 hover:text-text-secondary dark:hover:text-neutral-400 flex items-center justify-center space-x-2 transition-colors duration-300"
                            >
                                <i className="bi bi-arrow-left"></i>
                                <span>Back to Home</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;