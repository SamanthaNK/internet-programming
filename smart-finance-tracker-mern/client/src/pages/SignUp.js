import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import '../styles/auth.css';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        currency: 'XAF'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.currency
            );

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Navigate to signin with success message
                navigate('/signin', {
                    state: { message: 'Account created successfully! Please sign in.' }
                });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
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
                        <h1>Start Your Financial<br />Journey Today</h1>
                        <p>Join thousands managing their finances smartly with AI-powered insights</p>
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
                            <h2>Sign Up</h2>
                            <p>Create your free account</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <i className="bi bi-exclamation-circle"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-with-icon">
                                    <i className="bi bi-person"></i>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="Kim Namjoon"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

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
                                        minLength="8"
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
                                <small className="input-hint">At least 8 characters</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="currency">Currency</label>
                                <div className="input-with-icon">
                                    <i className="bi bi-cash"></i>
                                    <select
                                        name="currency"
                                        id="currency"
                                        className="form-select"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="XAF">XAF - Central African CFA Franc</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="NGN">NGN - Nigerian Naira</option>
                                        <option value="ZAR">ZAR - South African Rand</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-person-plus"></i>
                                        Create Account
                                    </>
                                )}
                            </button>

                            <div className="divider">
                                <span>or</span>
                            </div>

                            <div className="auth-footer">
                                <p>Already have an account? {' '} <Link to="/signin" className="link-primary">Sign in</Link></p>
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

export default SignUp;