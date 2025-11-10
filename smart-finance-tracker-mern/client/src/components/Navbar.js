import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/style.css';

function Navbar({ user }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-container">
                    <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
                        <i className="bi bi-tree-fill"></i>
                        FinanceTracker
                    </Link>

                    {user ? (
                        <>
                            <div className="navbar-menu">
                                <Link
                                    to="/dashboard"
                                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    Dashboard
                                </Link>
                                <Link
                                    to="/transactions"
                                    className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
                                >
                                    <i className="bi bi-list-ul"></i>
                                    Transactions
                                </Link>
                            </div>

                            <div className="navbar-actions">
                                <span className="user-name">{user.name}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    <i className="bi bi-box-arrow-right"></i>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="navbar-actions">
                            <Link to="/signin" className="btn btn-secondary btn-sm">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;