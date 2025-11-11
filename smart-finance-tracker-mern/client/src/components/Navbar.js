import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/session-timeout?reason=logout');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-bg-card dark:bg-neutral-800 border-b border-border-primary dark:border-neutral-700 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to={user ? "/dashboard" : "/"}
                        className="flex items-center space-x-2 text-[1.75rem] font-serif font-medium text-primary-kombu dark:text-primary-light hover:text-primary-moss dark:hover:text-primary-moss transition-all duration-300"
                    >
                        <i className="bi bi-tree-fill text-[1.75rem] text-primary-moss"></i>
                        <span className="tracking-wide">FinanceTracker</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-2">
                            <Link
                                to="/dashboard"
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-300 text-[0.9rem] tracking-wide ${isActive('/dashboard')
                                        ? 'bg-primary-light dark:bg-primary-moss text-primary-kombu dark:text-white font-medium'
                                        : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`}
                            >
                                <i className="bi bi-speedometer2 opacity-70"></i>
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/transactions"
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-300 text-[0.9rem] tracking-wide ${isActive('/transactions')
                                    ? 'bg-primary-light dark:bg-primary-moss text-primary-kombu dark:text-white font-medium'
                                    : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`}
                            >
                                <i className="bi bi-list-ul opacity-70"></i>
                                <span>Transactions</span>
                            </Link>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-3 ml-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all duration-300"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>

                            {/* User Info */}
                            <span className="text-[0.85rem] text-text-secondary dark:text-neutral-400 ml-2 font-light pl-4">
                                Welcome back, {user.name}
                            </span>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-6 py-2.5 ml-2 bg-accent-tan dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-primary-moss hover:text-white dark:hover:bg-neutral-600 transition-all duration-400 text-[0.95rem] tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                                className="p-3 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all duration-300"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>

                            <Link
                                to="/signin"
                                className="px-6 py-2.5 text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-all duration-300 text-[0.95rem] tracking-wide"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-3 bg-primary-kombu text-white rounded-lg hover:bg-accent-cafe hover:shadow-md transition-all duration-400 text-[0.95rem] tracking-wide transform hover:-translate-y-0.5"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                        aria-label="Toggle menu"
                    >
                        <i className={`bi bi-${isMenuOpen ? 'x' : 'list'} text-2xl`}></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border-primary dark:border-neutral-700">
                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${isActive('/dashboard')
                                        ? 'bg-primary-light dark:bg-primary-moss text-primary-kombu dark:text-white'
                                        : 'text-text-secondary dark:text-neutral-400'
                                        }`}
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/transactions"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${isActive('/transactions')
                                        ? 'bg-primary-light dark:bg-primary-moss text-primary-kombu dark:text-white'
                                        : 'text-text-secondary dark:text-neutral-400'
                                        }`}
                                >
                                    <i className="bi bi-list-ul"></i>
                                    <span>Transactions</span>
                                </Link>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-text-secondary dark:text-neutral-400 text-left rounded-lg hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <div className="px-4 py-3 text-sm text-text-secondary dark:text-neutral-400">
                                    {user.name}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-3 bg-accent-tan dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-primary-moss hover:text-white dark:hover:bg-neutral-600 transition-all"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-text-secondary dark:text-neutral-400 text-left rounded-lg hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <Link
                                    to="/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 bg-primary-kombu text-white text-center rounded-lg hover:bg-accent-cafe transition-all"
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