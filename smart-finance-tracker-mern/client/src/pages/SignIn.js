import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/auth.css';

function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Get success message from signup redirect
    React.useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="brand-icon">
                            <i className="bi bi-tree-fill"></i>
                        </div>
                        <h1>Welcome Back to<br />FinanceTracker</h1>
                        <p>Continue managing your finances</p>
                    </div>

                    <div className="decorative-elements">
                        <div className="leaf leaf-1">
                            <i className="bi bi-leaf"></i>
                        </div>
                        <div className="leaf leaf-2">
                            <i className="bi bi-flower1"></i>
                        </div>
                    </div>
                </div>

                <main className="auth-right">
                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h2>Sign In</h2>
                            <p>Access your account</p>
                        </div>

                        {success && (
                            <div className="alert alert-success">
                                <i className="bi bi-check-circle"></i>
                                <span>{success}</span>
                            </div>
                        )}

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
                                        name="email"
                                        className="form-control"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <i className="bi bi-lock"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <Link to="/reset-password" className="link-primary">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        Sign In
                                    </>
                                )}
                            </button>

                            <div className="divider">
                                <span>or</span>
                            </div>

                            <div className="auth-footer">
                                <p>
                                    Don't have an account? {' '}
                                    <Link to="/signup" className="link-primary">
                                        Create one
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className="back-home">
                            <Link to="/" className="link-secondary">
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SignIn;