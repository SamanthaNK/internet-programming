import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/style.css';

function Landing() {
    return (
        <div className="page-wrapper">
            <Navbar />

            <main className="landing-main">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="hero-content fade-in-up">
                            <h1>Take Control of Your Finances</h1>
                            <p>
                                Track Expenses. Set Budgets. Achieve Goals.
                            </p>
                            <div className="hero-actions">
                                <Link to="/signup" className="btn btn-primary">
                                    <i className="bi bi-person-plus"></i>
                                    Get Started Free
                                </Link>
                                <Link to="/signin" className="btn btn-outline">
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="container">
                        <h2 className="section-title">Everything You Need</h2>

                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <h3>Track Transactions</h3>
                                <p>Easily record income and expenses with smart categorization</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-pie-chart"></i>
                                </div>
                                <h3>Visual Reports</h3>
                                <p>Beautiful charts and insights to understand your spending</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-piggy-bank"></i>
                                </div>
                                <h3>Set Goals</h3>
                                <p>Create savings goals and track your progress</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h3>Secure & Private</h3>
                                <p>Your financial data is encrypted and protected</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Landing;