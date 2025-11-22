import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import { resetPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function ConfirmResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    const navigate = useNavigate();
    const { token } = useParams();
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        // Check if token exists
        if (!token) {
            setTokenValid(false);
            showToast.error('Invalid reset link');
        }
    }, [token]);

    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            showToast.error(passwordError);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, password);

            if (response.data.success) {
                // Store token and user data (auto-login after reset)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                showToast.success('Password reset successful! Redirecting to dashboard...');

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';

            if (message.includes('expired') || message.includes('invalid')) {
                setTokenValid(false);
                showToast.error('Reset link has expired or is invalid');
            } else {
                showToast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex bg-bg-primary dark:bg-neutral-900">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bg-secondary to-primary-light dark:from-neutral-800 dark:to-neutral-700 p-12 items-center justify-center relative overflow-hidden">
                    <div className="max-w-md z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-kombu to-primary-moss rounded-2xl flex items-center justify-center shadow-lg">
                                <i className="bi bi-tree-fill text-3xl text-white"></i>
                            </div>
                            <span className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">FinanceTracker</span>
                        </div>
                        <h1 className="text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">Link Expired</h1>
                        <p className="text-lg text-text-secondary dark:text-text-muted font-light">This password reset link is no longer valid</p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-accent-terracotta dark:bg-red-900 rounded-full opacity-20 blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-400 dark:bg-red-800 rounded-full opacity-20 blur-3xl" style={{ animation: 'float 3s ease-in-out infinite 1s' }}></div>
                </div>

                {/* Right Side - Error Message */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-md w-full">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                            <i className="bi bi-tree-fill text-3xl text-primary-kombu dark:text-primary-light"></i>
                            <span className="text-2xl font-serif font-medium text-text-primary dark:text-neutral-100">
                                FinanceTracker
                            </span>
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-800 transition-all duration-300"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                            <div className="w-20 h-20 bg-accent-terracotta/20 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-exclamation-triangle-fill text-4xl text-accent-terracotta dark:text-red-400"></i>
                            </div>

                            <h2 className="text-3xl font-serif font-medium text-text-primary dark:text-neutral-100 mb-4">
                                Link Expired
                            </h2>

                            <p className="text-text-secondary dark:text-neutral-400 mb-8">
                                This password reset link has expired or is invalid. Reset links are only valid for 10 minutes.
                            </p>

                            <div className="space-y-4">
                                <Link
                                    to="/reset-password"
                                    className="block w-full py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-accent-cafe dark:hover:bg-primary-dark transition-all duration-400 font-medium"
                                >
                                    Request New Reset Link
                                </Link>

                                <Link
                                    to="/signin"
                                    className="block w-full py-3 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-600 transition-all duration-300"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-bg-primary dark:bg-neutral-900">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bg-secondary to-primary-light dark:from-neutral-800 dark:to-neutral-700 p-12 items-center justify-center relative overflow-hidden">
                <div className="max-w-md z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-kombu to-primary-moss rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="bi bi-tree-fill text-3xl text-white"></i>
                        </div>
                        <span className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">FinanceTracker</span>
                    </div>
                    <h1 className="text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">Create New Password</h1>
                    <p className="text-lg text-text-secondary dark:text-text-muted font-light">Choose a strong password to secure your account</p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-accent-sage dark:bg-primary-moss rounded-full opacity-20 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-moss dark:bg-accent-sage rounded-full opacity-20 blur-3xl" style={{ animation: 'float 3s ease-in-out infinite 1s' }}></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                        <i className="bi bi-tree-fill text-3xl text-primary-kombu dark:text-primary-light"></i>
                        <span className="text-2xl font-serif font-medium text-text-primary dark:text-neutral-100">
                            FinanceTracker
                        </span>
                    </div>

                    {/* Dark Mode Toggle */}
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
                            <h2 className="text-3xl font-serif font-medium text-text-primary dark:text-neutral-100 mb-2">
                                Set New Password
                            </h2>
                            <p className="text-text-secondary dark:text-neutral-400 font-light">
                                Create a strong password for your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                <p className="text-xs text-text-muted dark:text-neutral-500 mt-1 font-light">
                                    Minimum 8 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <i className="bi bi-lock-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                        minLength="8"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400 hover:text-text-secondary dark:hover:text-neutral-300 transition-colors duration-300"
                                    >
                                        <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="bg-bg-secondary dark:bg-neutral-700 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-text-primary dark:text-neutral-100 mb-2">
                                        Password Requirements:
                                    </h4>
                                    <ul className="space-y-1 text-sm">
                                        <li className={`flex items-center ${password.length >= 8 ? 'text-accent-sage dark:text-green-400' : 'text-text-muted dark:text-neutral-500'}`}>
                                            <i className={`bi bi-${password.length >= 8 ? 'check-circle-fill' : 'circle'} mr-2`}></i>
                                            At least 8 characters
                                        </li>
                                        <li className={`flex items-center ${password === confirmPassword && password ? 'text-accent-sage dark:text-green-400' : 'text-text-muted dark:text-neutral-500'}`}>
                                            <i className={`bi bi-${password === confirmPassword && password ? 'check-circle-fill' : 'circle'} mr-2`}></i>
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-accent-cafe dark:hover:bg-primary-dark transition-all duration-400 disabled:opacity-50 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Resetting Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-shield-check"></i>
                                        <span>Reset Password</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/signin"
                                className="text-sm text-text-muted dark:text-neutral-500 hover:text-text-secondary dark:hover:text-neutral-400 flex items-center justify-center space-x-2 transition-colors duration-300"
                            >
                                <i className="bi bi-arrow-left"></i>
                                <span>Back to Sign In</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmResetPassword;