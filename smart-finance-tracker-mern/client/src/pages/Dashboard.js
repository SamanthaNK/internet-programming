import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import {
    getSummaryStats,
    getTransactions,
    createTransaction,
    getCategories,
    createCategory
} from '../services/api';
import { formatCurrency, formatDate, getUser, handleApiError } from '../utils/helpers';
import '../styles/dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeCount: 0,
        expenseCount: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [showModal, setShowModal] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [newCategory, setNewCategory] = useState({
        name: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(userData);
        loadData();
    }, [navigate, selectedPeriod]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [summaryRes, transactionsRes, categoriesRes] = await Promise.all([
                getSummaryStats(selectedPeriod),
                getTransactions({ limit: 5, sort: 'date-desc' }),
                getCategories()
            ]);

            setSummary(summaryRes.data.data);
            setRecentTransactions(transactionsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setError(handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (e) => {
        setNewCategory({
            ...newCategory,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createTransaction(formData);
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setShowModal(false);
            loadData();
        } catch (error) {
            setError(handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!newCategory.name.trim()) {
            setError('Please enter a category name');
            return;
        }

        try {
            await createCategory({
                name: newCategory.name,
                type: formData.type
            });
            setNewCategory({ name: '' });
            setShowCategoryForm(false);
            loadData();
        } catch (error) {
            setError(handleApiError(error));
        }
    };

    const filteredCategories = categories.filter(cat => cat.type === formData.type);

    return (
        <div className="page-wrapper">
            <Navbar user={user} />

            <div className="page-content">
                <div className="dashboard fade-in-up">
                    <div className="dashboard-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p className="text-muted">Your financial overview</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            <i className="bi bi-plus-circle"></i>
                            Add Transaction
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <i className="bi bi-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="period-selector">
                        <h3>Time Period</h3>
                        <div className="period-buttons">
                            {['month', 'year', 'all'].map(period => (
                                <button
                                    key={period}
                                    className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriod(period)}
                                >
                                    {period === 'month' ? 'This Month' :
                                        period === 'year' ? 'This Year' : 'All Time'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="summary-cards">
                        <div className="summary-card income">
                            <h3>Total Income</h3>
                            <div className="summary-amount">
                                {user?.currency || 'XAF'} {formatCurrency(summary.totalIncome)}
                            </div>
                            <p className="text-muted">{summary.incomeCount || 0} transactions</p>
                        </div>

                        <div className="summary-card expense">
                            <h3>Total Expenses</h3>
                            <div className="summary-amount">
                                {user?.currency || 'XAF'} {formatCurrency(summary.totalExpense)}
                            </div>
                            <p className="text-muted">{summary.expenseCount || 0} transactions</p>
                        </div>

                        <div className="summary-card balance">
                            <h3>Balance</h3>
                            <div className="summary-amount">
                                {user?.currency || 'XAF'} {formatCurrency(summary.balance)}
                            </div>
                            <p className="text-muted">
                                {selectedPeriod === 'month' ? 'This month' :
                                    selectedPeriod === 'year' ? 'This year' : 'All time'}
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Recent Transactions</h3>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-inbox empty-state-icon"></i>
                                <p>No transactions yet</p>
                                <p className="text-muted">Add your first transaction to get started!</p>
                            </div>
                        ) : (
                            <div className="transactions-list">
                                {recentTransactions.map(transaction => (
                                    <div key={transaction._id} className="transaction-item">
                                        <div className="transaction-icon">
                                            <i className={`bi ${transaction.type === 'income'
                                                ? 'bi-arrow-down-circle'
                                                : 'bi-arrow-up-circle'
                                                }`}></i>
                                        </div>
                                        <div className="transaction-details">
                                            <div className="transaction-title">
                                                {transaction.category?.name || 'Uncategorized'}
                                            </div>
                                            {transaction.description && (
                                                <div className="transaction-description">
                                                    {transaction.description}
                                                </div>
                                            )}
                                            <div className="transaction-date">
                                                {formatDate(transaction.transactionDate)}
                                            </div>
                                        </div>
                                        <div className={`transaction-amount ${transaction.type}`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {user?.currency || 'XAF'} {formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setError('');
                }}
                title="Add Transaction"
            >
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                            <i className="bi bi-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Amount ({user?.currency || 'XAF'})</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleFormChange}
                            className="form-control"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                className="form-select"
                                style={{ flex: 1 }}
                                required
                            >
                                <option value="">Select Category</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowCategoryForm(!showCategoryForm)}
                                className="btn btn-secondary"
                            >
                                {showCategoryForm ? 'Cancel' : '+ New'}
                            </button>
                        </div>
                    </div>

                    {showCategoryForm && (
                        <div className="new-category-form">
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleCategoryChange}
                                placeholder="Category name"
                                className="form-control"
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                className="btn btn-primary"
                            >
                                Create Category
                            </button>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="form-control"
                            placeholder="e.g., Grocery shopping"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default Dashboard;