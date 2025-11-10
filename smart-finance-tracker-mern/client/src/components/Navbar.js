import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

function Navbar({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/sessiontimeout');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to={user ? "/dashboard" : "/"}
                        className="flex items-center space-x-2 text-xl font-serif font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition"
                    >
                        <i className="bi bi-tree-fill text-2xl"></i>
                        <span>FinanceTracker</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/dashboard"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('/dashboard')
                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <i className="bi bi-speedometer2"></i>
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/transactions"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('/transactions')
                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <i className="bi bi-list-ul"></i>
                                <span>Transactions</span>
                            </Link>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>

                            {/* User Info */}
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {user.name}
                            </span>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>

                            <Link
                                to="/signin"
                                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                        aria-label="Toggle menu"
                    >
                        <i className={`bi bi-${isMenuOpen ? 'x' : 'list'} text-2xl`}></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-700">
                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${isActive('/dashboard')
                                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                            : 'text-neutral-600 dark:text-neutral-400'
                                        }`}
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/transactions"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${isActive('/transactions')
                                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                            : 'text-neutral-600 dark:text-neutral-400'
                                        }`}
                                >
                                    <i className="bi bi-list-ul"></i>
                                    <span>Transactions</span>
                                </Link>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-neutral-600 dark:text-neutral-400 text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <div className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                                    {user.name}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-neutral-600 dark:text-neutral-400 text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <Link
                                    to="/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;