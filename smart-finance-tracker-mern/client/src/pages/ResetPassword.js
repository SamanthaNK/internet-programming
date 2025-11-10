import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';
import '../styles/auth.css';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page-wrapper">
                <div className="auth-content-center">
                    <div className="auth-card">
                        <div className="session-icon-wrapper">
                            <i className="bi bi-key"></i>
                        </div>

                        <h1 className="session-title">Reset Password</h1>
                        <p className="session-message">
                            Enter your email address and we'll send you instructions to reset your password
                        </p>

                        {success ? (
                            <>
                                <div className="alert alert-success">
                                    <i className="bi bi-check-circle"></i>
                                    <span>Password reset instructions sent! Check your email.</span>
                                </div>

                                <div className="session-actions">
                                    <Link to="/signin" className="btn btn-primary btn-full">
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        Back to Sign In
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                {error && (
                                    <div className="alert alert-error">
                                        <i className="bi bi-exclamation-circle"></i>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <div className="input-with-icon">
                                            <i className="bi bi-envelope"></i>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                placeholder="your.email@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-full"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Instructions'}
                                    </button>
                                </form>

                                <div className="back-home">
                                    <Link to="/signin" className="link-secondary">
                                        <i className="bi bi-arrow-left"></i> Back to Sign In
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;