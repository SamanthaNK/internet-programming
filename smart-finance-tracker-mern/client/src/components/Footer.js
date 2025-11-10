import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <i className="bi bi-tree-fill"></i>
                            <span>FinanceTracker</span>
                        </div>
                        <p> Smart financial management for a better tomorrow</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/transactions">Transactions</Link>
                            <Link to="/reports">Reports</Link>
                        </div>

                        <div className="footer-column">
                            <h4>Company</h4>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                        </div>

                        <div className="footer-column">
                            <h4>Support</h4>
                            <Link to="/faq">FAQ</Link>
                            <Link to="/help">Help Center</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;