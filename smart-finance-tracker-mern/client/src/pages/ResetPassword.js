import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setSuccess(true);
            toast.success('Reset instructions sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email');
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
                            <i className="bi bi-key text-4xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-3xl font-serif font-medium text-neutral-900 dark:text-neutral-100 mb-2">Reset Password</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Enter your email address and we'll send you instructions to reset your password
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg text-center">
                                <i className="bi bi-check-circle text-4xl text-green-600 dark:text-green-400 mb-2 block"></i>
                                <p className="text-green-800 dark:text-green-200">Password reset instructions sent! Check your email.</p>
                            </div>

                            <Link
                                to="/signin"
                                className="flex items-center justify-center space-x-2 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                                <i className="bi bi-box-arrow-in-right"></i>
                                <span>Back to Sign In</span>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                        placeholder="your.email@example.com"
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
                                {loading ? 'Sending...' : 'Send Reset Instructions'}
                            </button>

                            <div className="text-center">
                                <Link to="/signin" className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400 flex items-center justify-center space-x-2">
                                    <i className="bi bi-arrow-left"></i>
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
