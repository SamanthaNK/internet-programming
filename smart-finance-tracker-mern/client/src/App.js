import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import sessionManager from './utils/sessionManager';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import ConfirmResetPassword from './pages/ConfirmResetPassword';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transaction';
import Reports from './pages/Reports';
import Budget from './pages/Budget';
import SessionTimeout from './pages/SessionTimeout';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Check if session is still valid
    if (token && !sessionManager.isSessionValid()) {
        sessionManager.logout();
        return <Navigate to="/session-timeout?reason=timeout" replace />;
    }

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Check if session is still valid
    if (token && sessionManager.isSessionValid()) {
        return <Navigate to="/dashboard" replace />;
    }

    // If token exists but session expired, clean up
    if (token && !sessionManager.isSessionValid()) {
        sessionManager.logout();
    }

    return children;
};

function App() {
    // Set page title and favicon
    useEffect(() => {
        document.title = 'Smart Finance Tracker';

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }

        link.href = '/Financetracker.ico';
        link.type = 'image/x-icon';
    }, []);

    // Initialize session manager on app load
    useEffect(() => {
        sessionManager.init();

        // Cleanup on unmount
        return () => {
            sessionManager.cleanup();
        };
    }, []);

    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/signin"
                            element={
                                <PublicRoute>
                                    <SignIn />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <SignUp />
                                </PublicRoute>
                            }
                        />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/reset-password/:token" element={<ConfirmResetPassword />} />
                        <Route path="/session-timeout" element={<SessionTimeout />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/transactions"
                            element={
                                <ProtectedRoute>
                                    <Transactions />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 - Catch all */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    {/* Toast Notifications */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;