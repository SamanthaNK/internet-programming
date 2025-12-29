import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 text-2xl font-serif font-medium text-primary-600 dark:text-primary-400 mb-4">
                            <i className="bi bi-tree-fill text-2xl"></i>
                            <span>FinanceTracker</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Smart financial management for a better tomorrow
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 uppercase mb-4">Product</h4>
                        <div className="space-y-2">
                            <Link to="/dashboard" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                                Dashboard
                            </Link>
                            <Link to="/transactions" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                                Transactions
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 uppercase mb-4">Support</h4>
                        <div className="space-y-2">
                            <a href="https://make-everything-ok.com/" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                                Help Center
                            </a>
                            <a href="https://make-everything-ok.com/" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        &copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;