import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function ConfirmResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const { isDark, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, password);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                toast.success('Password reset successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
            <div className="max-w-md w-full">
                <div className="flex justify-end mb-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                        <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                    </button>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-shield-lock text-4xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-3xl font-serif font-medium text-neutral-900 dark:text-neutral-100 mb-2">Set New Password</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    required
                                    minLength="8"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                >
                                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">At least 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <i className="bi bi-lock-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div className="text-center">
                            <Link to="/signin" className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400 flex items-center justify-center space-x-2">
                                <i className="bi bi-arrow-left"></i>
                                <span>Back to Sign In</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConfirmResetPassword;