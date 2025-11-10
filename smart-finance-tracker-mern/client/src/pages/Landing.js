import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Landing() {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
            <Navbar />

            {/* Hero Section */}
            <section className="flex-1 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl font-serif font-medium text-primary-900 dark:text-primary-50 mb-6">
                                Take Control of Your Finances
                            </h1>
                            <p className="text-xl text-primary-700 dark:text-primary-200 mb-8">
                                Track expenses. Set budgets. Achieve your financial goals with smart insights.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg text-lg font-medium"
                                >
                                    <i className="bi bi-person-plus"></i>
                                    <span>Get Started Free</span>
                                </Link>
                                <Link
                                    to="/signin"
                                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition shadow-lg text-lg font-medium"
                                >
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative">
                                <i className="bi bi-graph-up-arrow text-[200px] text-primary-600 dark:text-primary-400 opacity-30 animate-pulse"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-serif font-medium text-center text-neutral-900 dark:text-neutral-100 mb-16">
                        Everything You Need
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-cash-coin text-4xl text-primary-600 dark:text-primary-400"></i>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">Track Transactions</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Easily record income and expenses with smart categorization
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-pie-chart text-4xl text-primary-600 dark:text-primary-400"></i>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">Visual Reports</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Beautiful charts and insights to understand your spending
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-piggy-bank text-4xl text-primary-600 dark:text-primary-400"></i>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">Set Goals</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Create savings goals and track your progress
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-shield-check text-4xl text-primary-600 dark:text-primary-400"></i>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">Secure & Private</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Your financial data is encrypted and protected
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Landing;