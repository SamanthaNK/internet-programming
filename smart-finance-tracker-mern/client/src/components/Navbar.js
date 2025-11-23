import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        navigate('/session-timeout?reason=logout');
    };

    // Handle scroll for sticky navbar with blur
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-bg-card/80 dark:bg-neutral-800/80 backdrop-blur-lg shadow-md'
            : 'bg-bg-card dark:bg-neutral-800'
            } border-b border-border-primary dark:border-neutral-700`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    <NavLink
                        to={user ? "/dashboard" : "/"}
                        className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-[1.75rem] font-serif font-medium text-primary-kombu dark:text-primary-light hover:text-primary-moss dark:hover:text-primary-moss transition-all duration-300"
                    >
                        <i className="bi bi-tree-fill text-lg sm:text-[1.75rem] text-primary-moss"></i>
                        <span className="tracking-wide hidden sm:inline">FinanceTracker</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-speedometer2 opacity-70"></i>
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/transactions"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-list-ul opacity-70"></i>
                                <span>Transactions</span>
                            </NavLink>

                            <NavLink
                                to="/budgets"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-pie-chart-fill opacity-70"></i>
                                <span>Budgets</span>
                            </NavLink>

                            <NavLink
                                to="/goals"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-bullseye opacity-70"></i>
                                <span>Goals</span>
                            </NavLink>

                            <NavLink
                                to="/reports"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-graph-up opacity-70"></i>
                                <span>Reports</span>
                            </NavLink>

                            <NavLink
                                to="/export"
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-2 lg:px-4 py-2 rounded-lg transition-colors duration-300 text-xs lg:text-[0.9rem] tracking-wide ${isActive
                                        ? 'text-primary-moss dark:text-primary-light font-semibold'
                                        : 'text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200'
                                    }`
                                }
                            >
                                <i className="bi bi-box-arrow-up-right opacity-70"></i>
                                <span>Export</span>
                            </NavLink>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleTheme();
                                }}
                                type="button"
                                className="p-2 lg:p-3 lg:ml-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors duration-300"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-lg lg:text-xl`}></i>
                            </button>

                            {/* User Menu */}
                            <div className="relative lg:ml-2" ref={userMenuRef}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowUserMenu(!showUserMenu);
                                    }}
                                    type="button"
                                    className="flex items-center space-x-1 px-2 lg:px-4 py-2 lg:py-2.5 rounded-lg text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors duration-300"
                                >
                                    <i className="bi bi-person-circle text-lg lg:text-xl"></i>
                                    <span className="text-xs lg:text-[0.85rem] hidden lg:inline">{user.name}</span>
                                    <i className={`bi bi-chevron-${showUserMenu ? 'up' : 'down'} text-xs hidden lg:inline`}></i>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-40 lg:w-48 bg-bg-card dark:bg-neutral-800 rounded-lg shadow-xl border border-border-primary dark:border-neutral-700 py-2 z-[100]">
                                        <NavLink
                                            to="/settings"
                                            end
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowUserMenu(false);
                                            }}
                                            className="flex items-center space-x-2 px-4 py-2 text-xs lg:text-sm text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                                        >
                                            <i className="bi bi-gear"></i>
                                            <span>Settings</span>
                                        </NavLink>
                                        <div className="border-t border-border-primary dark:border-neutral-700 my-2"></div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleLogout();
                                                setShowUserMenu(false);
                                            }}
                                            type="button"
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-xs lg:text-sm text-accent-terracotta dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                                        >
                                            <i className="bi bi-box-arrow-right"></i>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2 lg:gap-4">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleTheme();
                                }}
                                type="button"
                                className="p-2 lg:p-3 rounded-lg text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors duration-300"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-lg lg:text-xl`}></i>
                            </button>

                            <NavLink
                                to="/signin"
                                className="px-3 lg:px-6 py-2 lg:py-2.5 text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-all duration-300 text-xs lg:text-[0.95rem] tracking-wide"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="px-3 lg:px-6 py-2 lg:py-3 bg-primary-kombu text-white rounded-lg hover:bg-accent-cafe hover:shadow-md transition-all duration-400 text-xs lg:text-[0.95rem] tracking-wide transform hover:-translate-y-0.5"
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="md:hidden p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                        aria-label="Toggle menu"
                    >
                        <i className={`bi bi-${isMenuOpen ? 'x' : 'list'} text-xl sm:text-2xl`}></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border-primary dark:border-neutral-700">
                        {user ? (
                            <div className="space-y-2">
                                <NavLink
                                    to="/dashboard"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span>Dashboard</span>
                                </NavLink>

                                <NavLink
                                    to="/transactions"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-list-ul"></i>
                                    <span>Transactions</span>
                                </NavLink>

                                <NavLink
                                    to="/budgets"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-pie-chart-fill"></i>
                                    <span>Budgets</span>
                                </NavLink>

                                <NavLink
                                    to="/goals"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-bullseye"></i>
                                    <span>Goals</span>
                                </NavLink>

                                <NavLink
                                    to="/reports"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-graph-up"></i>
                                    <span>Reports</span>
                                </NavLink>

                                <NavLink
                                    to="/export"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-file-earmark-arrow-up"></i>
                                    <span>Export</span>
                                </NavLink>

                                <NavLink
                                    to="/settings"
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${isActive
                                            ? 'text-primary-moss dark:text-primary-light font-semibold'
                                            : 'text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700'
                                        }`
                                    }
                                >
                                    <i className="bi bi-gear"></i>
                                    <span>Settings</span>
                                </NavLink>

                                <button
                                    onClick={toggleTheme}
                                    type="button"
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
                                    type="button"
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
                                    type="button"
                                    className="flex items-center space-x-2 w-full px-4 py-3 text-text-secondary dark:text-neutral-400 text-left rounded-lg hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <NavLink
                                    to="/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    Sign In
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 bg-primary-kombu text-white text-center rounded-lg hover:bg-accent-cafe transition-all"
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;