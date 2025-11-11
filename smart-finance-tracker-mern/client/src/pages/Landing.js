import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Landing() {
    const features = [
        { icon: 'bi-cash-coin', title: 'Track Transactions', desc: 'Easily record income and expenses with smart categorization' },
        { icon: 'bi-pie-chart', title: 'Visual Reports', desc: 'Beautiful charts and insights to understand your spending' },
        { icon: 'bi-piggy-bank', title: 'Set Goals', desc: 'Create savings goals and track your progress' },
        { icon: 'bi-shield-check', title: 'Secure & Private', desc: 'Your financial data is encrypted and protected' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900 text-text-primary dark:text-neutral-100">
            <Navbar />

            {/* Hero Section */}
            <section className="flex-1 relative overflow-hidden px-8 py-32 hero-light dark:hero-dark hero-deco">
                <div className="max-w-[1400px] mx-auto relative z-10 text-center">
                    <h1 className="font-serif font-medium mb-6 text-[3.5rem] leading-tight text-accent-cafe dark:text-border-primary">
                        Take Control of Your Finances
                    </h1>

                    <p className="text-xl mb-10 font-light leading-relaxed max-w-xl mx-auto text-text-secondary dark:text-text-muted">
                        Track Expenses. Set Budgets. Achieve Goals.
                    </p>


                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            to="/signup"
                            className="inline-flex items-center space-x-2 px-8 py-4 text-lg rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 -translate-y-0 hover:-translate-y-1 bg-primary-kombu text-white tracking-wide"
                        >
                            <i className="bi bi-person-plus"></i>
                            <span>Get Started Free</span>
                        </Link>


                        <Link
                            to="/signin"
                            className="inline-flex items-center space-x-2 px-8 py-4 text-lg rounded-lg border-2 transition-all duration-300 tracking-wide text-[#354024] border-[#354024] bg-transparent hover:bg-[#354024]/10 dark:text-[#d7e3cf] dark:border-[#d7e3cf]"
                        >
                            <i className="bi bi-box-arrow-in-right"></i>
                            <span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-bg-card dark:bg-neutral-800">
                <div className="max-w-[1400px] mx-auto px-8">
                    <h2 className="text-4xl font-serif font-medium text-center mb-16 text-primary-kombu dark:text-[var(--bg-secondary)]">
                        Everything You Need
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl transition-all duration-300 hover:shadow-lg bg-bg-secondary dark:bg-neutral-700 border border-border-primary dark:border-neutral-600"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-moss">
                                    <i className={`bi ${feature.icon} text-4xl text-primary-kombu dark:text-[var(--bg-secondary)]`}></i>
                                </div>
                                <h3 className="text-xl font-medium mb-3 font-serif text-primary-kombu dark:text-[var(--bg-secondary)]">
                                    {feature.title}
                                </h3>
                                <p className="text-base font-light leading-relaxed text-text-secondary dark:text-text-muted">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Landing;