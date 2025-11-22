import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    // Handle scroll for sticky navbar with blur
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            number: '01',
            title: 'Create Account',
            desc: 'Sign up with your email in minutes.'
        },
        {
            number: '02',
            title: 'Add Transactions',
            desc: 'Log income and expenses with smart categories.'
        },
        {
            number: '03',
            title: 'Set Budgets',
            desc: 'Create monthly budgets with alerts.'
        },
        {
            number: '04',
            title: 'Track Progress',
            desc: 'Monitor financial health with insights.'
        }
    ];

    const faqs = [
        {
            question: 'What is Smart Finance Tracker?',
            answer: 'A personal finance management tool to track expenses, manage budgets, set goals, and gain AI-powered insights.'
        },
        {
            question: 'Is my financial data secure?',
            answer: 'Yes! We use bank-level encryption, secure JWT authentication, and industry-standard protocols. Your data is never shared.'
        },
        {
            question: 'Can I use multiple currencies?',
            answer: 'Absolutely! We support XAF, USD, EUR, GBP, NGN, and ZAR. Set your preferred currency anytime.'
        },
        {
            question: 'How do AI-powered insights work?',
            answer: 'Our AI analyzes spending patterns, identifies trends, and provides personalized recommendations.'
        },
        {
            question: 'Can I export my financial data?',
            answer: 'Yes! Export transaction history and reports in CSV and PDF formats.'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            {/* Sticky Navigation with Blur */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-bg-card/80 dark:bg-neutral-800/80 backdrop-blur-lg shadow-md'
                : 'bg-bg-card dark:bg-neutral-800'
                } border-b border-border-primary dark:border-neutral-700`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-serif font-medium text-primary-kombu dark:text-primary-light hover:text-primary-moss dark:hover:text-primary-moss transition-colors">
                            <i className="bi bi-tree-fill text-2xl text-primary-moss"></i>
                            <span className="tracking-wide">FinanceTracker</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-primary-light transition-colors text-sm font-medium">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-primary-light transition-colors text-sm font-medium">
                                How It Works
                            </a>
                            <a href="#faq" className="text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-primary-light transition-colors text-sm font-medium">
                                FAQ
                            </a>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 transition-all"
                                aria-label="Toggle dark mode"
                            >
                                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
                            </button>
                            <Link
                                to="/signin"
                                className="px-5 py-2 text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 bg-primary-kombu text-white rounded-lg hover:bg-accent-cafe hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium"
                            >
                                Get Started
                            </Link>
                        </div>

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
                        <div className="md:hidden py-4 border-t border-border-primary dark:border-neutral-700 animate-fadeIn">
                            <div className="space-y-2">
                                <a
                                    href="#features"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    Features
                                </a>
                                <a
                                    href="#how-it-works"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    FAQ
                                </a>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center w-full px-4 py-3 text-text-secondary dark:text-neutral-400 hover:bg-bg-secondary dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill mr-3`}></i>
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
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section with Light Gradient */}
            <section className="relative overflow-hidden py-20 md:py-32">

                {/* Light Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-sage via-primary-light to-bg-primary dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-900"></div>

                {/* Soft fade to white at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent dark:from-neutral-900 dark:to-transparent"></div>

                {/* Decorative elements */}
                <div className="absolute top-20 right-20 h-64 w-64 bg-primary-light rounded-full blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 left-20 h-80 w-80 bg-accent-sage rounded-full blur-3xl opacity-30"
                    style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center place-items-center">

                        {/* Left Content */}
                        <div className="animate-fadeIn text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-primary-kombu mb-6 sm:mb-8 leading-tight">
                                A way to track your{' '}
                                <span className="text-accent-cafe">finances</span>
                            </h1>

                            <p className="text-lg text-text-secondary mb-8 font-light leading-relaxed">
                                Track expenses, manage budgets, and achieve your financial goals with AI-powered insights. Your journey to financial freedom starts here.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-primary-kombu text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                                >
                                    <i className="bi bi-arrow-right-circle"></i>
                                    <span>Get Started</span>
                                </Link>

                                <Link
                                    to="/signin"
                                    className="inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 border-primary-kombu text-primary-kombu rounded-lg hover:bg-primary-kombu/10 backdrop-blur-sm transition-all duration-300"
                                >
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex justify-center items-center">
                            {/* Image */}
                            <img
                                src="/assets/potted_plant.png"
                                alt="Financial Growth Plant"
                                className="w-64 sm:w-80 md:w-96 lg:w-[28rem] object-contain drop-shadow-2xl select-none pointer-events-none transition-transform duration-700 hover:scale-105"
                                style={{ animation: 'float 6s ease-in-out infinite' }}
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* Feature Section 1*/}
            <section section className="py-20 bg-bg-card dark:bg-neutral-900" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                        {/* Visual - Left */}
                        <div className="order-2 md:order-1">
                            <div className="relative bg-gradient-to-br from-accent-seafoam/20 to-primary-light/30 dark:from-accent-seafoam/10 dark:to-primary-moss/10 rounded-3xl p-12 border border-border-primary dark:border-neutral-700">
                                <div className="flex items-center justify-center h-80">
                                    <div className="relative">
                                        {/* Main Icon */}
                                        <div className="w-32 h-32 bg-gradient-to-br from-primary-moss to-accent-cafe rounded-full flex items-center justify-center shadow-2xl">
                                            <i className="bi bi-grid-3x3-gap-fill text-5xl text-white"></i>
                                        </div>

                                        {/* Floating mini cards */}
                                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-accent-sage rounded-2xl flex items-center justify-center shadow-xl animate-float">
                                            <i className="bi bi-wallet2 text-2xl text-white"></i>
                                        </div>
                                        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent-terracotta rounded-2xl flex items-center justify-center shadow-xl" style={{ animation: 'float 3s ease-in-out infinite 1s' }}>
                                            <i className="bi bi-receipt text-2xl text-white"></i>
                                        </div>
                                        <div className="absolute top-1/2 -right-12 w-16 h-16 bg-primary-light dark:bg-primary-moss/30 rounded-xl flex items-center justify-center shadow-lg" style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                                            <i className="bi bi-graph-up text-xl text-primary-kombu dark:text-primary-light"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content - Right */}
                        <div className="order-1 md:order-2 w-full">
                            <h2 className="text-3xl md:text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                                Your finances in one place
                            </h2>
                            <p className="text-lg text-text-secondary dark:text-neutral-400 mb-6 font-light leading-relaxed">
                                Keep all your accounts, transactions, and spending data in one dashboard.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Track transactions across all accounts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Real-time balance updates and spending alerts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Smart categorization of expenses</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 2 */}
            <section section className="py-20 bg-bg-secondary dark:bg-neutral-800" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Content - Left */}
                        <div className="w-full">
                            <h2 className="text-3xl md:text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                                Easy access anywhere
                            </h2>
                            <p className="text-lg text-text-secondary dark:text-neutral-400 mb-6 font-light leading-relaxed">
                                Access your finances from any device, anytime.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Secure cloud sync across all devices</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Optimized for desktop, tablet, and mobile</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Offline mode for viewing data</span>
                                </li>
                            </ul>
                        </div>

                        {/* Visual - Right */}
                        <div>
                            <div className="relative bg-gradient-to-br from-primary-light/30 to-accent-tan/20 dark:from-primary-moss/10 dark:to-accent-cafe/10 rounded-3xl p-12 border border-border-primary dark:border-neutral-700">
                                <div className="flex items-center justify-center h-80">
                                    <div className="relative">
                                        {/* Devices mockup with icons */}
                                        <div className="w-40 h-48 bg-gradient-to-br from-primary-kombu to-primary-moss rounded-3xl flex flex-col items-center justify-center shadow-2xl transform rotate-6">
                                            <i className="bi bi-phone text-6xl text-white mb-4"></i>
                                            <div className="space-y-1">
                                                <div className="w-16 h-1 bg-white/40 rounded"></div>
                                                <div className="w-12 h-1 bg-white/40 rounded"></div>
                                                <div className="w-14 h-1 bg-white/40 rounded"></div>
                                            </div>
                                        </div>

                                        {/* Tablet overlay */}
                                        <div className="absolute -right-12 bottom-0 w-32 h-40 bg-accent-sage rounded-2xl flex items-center justify-center shadow-xl transform -rotate-6">
                                            <i className="bi bi-tablet text-5xl text-white"></i>
                                        </div>

                                        {/* Desktop icon */}
                                        <div className="absolute -left-8 top-8 w-24 h-20 bg-accent-seafoam rounded-xl flex items-center justify-center shadow-lg">
                                            <i className="bi bi-laptop text-3xl text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 3 - Track expense data */}
            <section section className="py-20 bg-bg-card dark:bg-neutral-900" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Visual - Left */}
                        <div className="order-2 md:order-1">
                            <div className="relative bg-gradient-to-br from-accent-terracotta/20 to-accent-sand/30 dark:from-accent-terracotta/10 dark:to-accent-cafe/10 rounded-3xl p-12 border border-border-primary dark:border-neutral-700">
                                <div className="flex items-center justify-center h-80">
                                    <div className="relative">
                                        {/* Chart representation */}
                                        <div className="w-48 h-56 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6">
                                            <div className="flex items-end justify-between h-full gap-2">
                                                <div className="w-8 h-24 bg-primary-moss rounded-t-lg"></div>
                                                <div className="w-8 h-36 bg-accent-sage rounded-t-lg"></div>
                                                <div className="w-8 h-20 bg-primary-light dark:bg-primary-moss/40 rounded-t-lg"></div>
                                                <div className="w-8 h-40 bg-accent-terracotta rounded-t-lg"></div>
                                            </div>
                                        </div>

                                        {/* Floating stat cards */}
                                        <div className="absolute -top-4 -right-4 bg-white dark:bg-neutral-800 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2">
                                            <i className="bi bi-arrow-up-right text-accent-sage"></i>
                                            <span className="text-sm font-medium text-accent-sage">+15%</span>
                                        </div>
                                        <div className="absolute -bottom-4 -left-4 bg-white dark:bg-neutral-800 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2">
                                            <i className="bi bi-calendar-check text-primary-moss"></i>
                                            <span className="text-xs text-text-secondary dark:text-neutral-400">Monthly</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content - Right */}
                        <div className="order-1 md:order-2 w-full">
                            <h2 className="text-3xl md:text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                                Easily track expense data
                            </h2>
                            <p className="text-lg text-text-secondary dark:text-neutral-400 mb-6 font-light leading-relaxed">
                                Visualize where your money goes with easy, clear insights and make informed decisions.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Interactive charts and graphs for spending analysis</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Category-wise expense breakdown</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-primary-moss text-xl mt-1"></i>
                                    <span className="text-text-secondary dark:text-neutral-400 font-light">Monthly, yearly, and custom period reports</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section section id="how-it-works" className="py-20 bg-bg-secondary dark:bg-neutral-800" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-text-secondary dark:text-neutral-400 max-w-2xl mx-auto font-light">
                            Get started in minutes with our simple four-step process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-primary-moss/30 dark:bg-primary-moss/20"></div>
                                )}
                                <div className="relative z-10 bg-bg-card dark:bg-neutral-900 rounded-xl p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-moss text-white text-2xl font-bold mb-4 shadow-md">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-medium text-primary-kombu dark:text-primary-light mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-text-secondary dark:text-neutral-400 font-light">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section section id="faq" className="py-20 bg-bg-card dark:bg-neutral-900" >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-accent-cafe dark:text-primary-light mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-text-secondary dark:text-neutral-400 font-light">
                            Got questions? We've got answers
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-bg-secondary dark:bg-neutral-800 rounded-xl p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
                            >
                                <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-text-secondary dark:text-neutral-400 font-light">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section section className="py-20 bg-gradient-to-b from-bg-primary via-primary-light to-accent-sage dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700" >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary-kombu dark:text-primary-light mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-neutral-400 mb-8 font-light">
                        Join thousands of users taking control of their finances with Smart Finance Tracker
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center space-x-2 px-8 py-4 text-lg bg-primary-kombu dark:bg-primary-moss text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium dark:hover:bg-primary-kombu"
                    >
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Create Free Account</span>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <section footer className="bg-bg-secondary dark:bg-neutral-800 border-t border-border-primary dark:border-neutral-700 py-12" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 text-2xl font-serif font-medium text-primary-kombu dark:text-primary-light mb-4">
                                <i className="bi bi-tree-fill text-2xl text-primary-moss"></i>
                                <span>FinanceTracker</span>
                            </div>
                            <p className="text-text-secondary dark:text-neutral-400 text-sm font-light">
                                Smart financial management for a better tomorrow
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-primary-kombu dark:text-primary-light uppercase mb-4">Product</h4>
                            <div className="space-y-2">
                                <Link to="/dashboard" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/transactions" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors">
                                    Transactions
                                </Link>
                                <a href="#features" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors">
                                    Features
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-primary-kombu dark:text-primary-light uppercase mb-4">Support</h4>
                            <div className="space-y-2">
                                <a href="#faq" className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors">
                                    FAQ
                                </a>
                                <button className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors text-left bg-transparent border-none cursor-pointer">
                                    Help Center
                                </button>
                                <button className="block text-sm text-text-secondary dark:text-neutral-400 hover:text-primary-moss dark:hover:text-primary-light transition-colors text-left bg-transparent border-none cursor-pointer">
                                    Privacy Policy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border-primary dark:border-neutral-700 text-center">
                        <p className="text-sm text-text-muted dark:text-neutral-500 font-light">
                            &copy; {new Date().getFullYear()} Smart Finance Tracker. All rights reserved.
                        </p>
                    </div>
                </div>
            </section>
        </div >
    );
}

export default Landing;