import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            const response = await requestPasswordReset(email);

            if (response.data.success) {
                setEmailSent(true);
                toast.success('Password reset instructions sent to your email');
            }
        } catch (error) {
            // Show generic message for security (don't reveal if email exists)
            toast.info('If an account exists with this email, a reset link has been sent');
            setEmailSent(true);
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
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
                        <h1 className="text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">Check Your Email</h1>
                        <p className="text-lg text-text-secondary dark:text-text-muted font-light">We've sent you instructions to reset your password</p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-accent-sage dark:bg-primary-moss rounded-full opacity-20 blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-moss dark:bg-accent-sage rounded-full opacity-20 blur-3xl" style={{ animation: 'float 3s ease-in-out infinite 1s' }}></div>
                </div>

                {/* Right Side - Success Message */}
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
                            <div className="w-20 h-20 bg-accent-sage/20 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-envelope-check-fill text-4xl text-accent-sage dark:text-green-400"></i>
                            </div>

                            <h2 className="text-3xl font-serif font-medium text-text-primary dark:text-neutral-100 mb-4">
                                Check Your Email
                            </h2>

                            <p className="text-text-secondary dark:text-neutral-400 mb-6">
                                We've sent password reset instructions to:
                            </p>

                            <p className="text-primary-moss dark:text-primary-light font-medium mb-8">
                                {email}
                            </p>

                            <div className="bg-bg-secondary dark:bg-neutral-700 rounded-lg p-4 mb-6 text-left">
                                <h3 className="text-sm font-medium text-text-primary dark:text-neutral-100 mb-2">
                                    Next Steps:
                                </h3>
                                <ol className="text-sm text-text-secondary dark:text-neutral-400 space-y-2 list-decimal list-inside">
                                    <li>Check your email inbox</li>
                                    <li>Click the password reset link</li>
                                    <li>Enter your new password</li>
                                    <li>Sign in with your new password</li>
                                </ol>
                            </div>

                            <div className="bg-accent-sand/20 dark:bg-yellow-900/20 border border-accent-sand dark:border-yellow-700 rounded-lg p-4 mb-6">
                                <p className="text-sm text-text-secondary dark:text-neutral-400">
                                    <i className="bi bi-info-circle mr-2"></i>
                                    The reset link will expire in <strong>10 minutes</strong>.
                                    If you don't see the email, check your spam folder.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    to="/signin"
                                    className="block w-full py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-accent-cafe dark:hover:bg-primary-dark transition-all duration-400 font-medium"
                                >
                                    Back to Sign In
                                </Link>

                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="w-full py-3 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-600 transition-all duration-300"
                                >
                                    Resend Email
                                </button>
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
                    <h1 className="text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">Reset Password</h1>
                    <p className="text-lg text-text-secondary dark:text-text-muted font-light">Enter your email to receive reset instructions</p>
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
                                Reset Password
                            </h2>
                            <p className="text-text-secondary dark:text-neutral-400 font-light">
                                Enter your email address and we'll send you instructions to reset your password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-neutral-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-neutral-400"></i>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-all duration-300"
                                        placeholder="your.email@example.com"
                                        required
                                        disabled={loading}
                                    />
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
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-envelope-fill"></i>
                                        <span>Send Reset Link</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 space-y-4">
                            <div className="text-center">
                                <Link
                                    to="/signin"
                                    className="text-primary-moss dark:text-primary-light hover:text-primary-kombu dark:hover:text-primary-moss transition-colors duration-300 flex items-center justify-center space-x-2"
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>

                            <div className="text-center pt-4 border-t border-border-primary dark:border-neutral-700">
                                <p className="text-sm text-text-secondary dark:text-neutral-400">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/signup"
                                        className="text-primary-moss dark:text-primary-light hover:text-primary-kombu dark:hover:text-primary-moss font-medium transition-colors duration-300"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;