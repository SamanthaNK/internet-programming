import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import {
    getTransactions,
    deleteTransaction,
    createTransaction,
    getCategories,
    createCategory
} from '../services/api';
import '../styles/transaction.css';

function Transactions() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const [filters, setFilters] = useState({
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        sort: 'date-desc'
    });

    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(userData));
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            const [transactionsRes, categoriesRes] = await Promise.all([
                getTransactions(filters),
                getCategories()
            ]);

            setTransactions(transactionsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFilterChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        loadData();
    };

    const resetFilters = () => {
        setFilters({
            type: '',
            category: '',
            startDate: '',
            endDate: '',
            sort: 'date-desc'
        });
        setTimeout(() => loadData(), 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            alert('Error: ' + (error.response?.data?.message || 'Failed to add transaction'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!newCategory.name.trim()) {
            alert('Please enter a category name');
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
            alert('Error: ' + (error.response?.data?.message || 'Failed to create category'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await deleteTransaction(id);
                loadData();
            } catch (error) {
                alert('Error deleting transaction');
            }
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredCategories = categories.filter(cat => cat.type === formData.type);

    return (
        <div className="page-wrapper">
            <Navbar user={user} />

            <div className="page-content">
                <div className="container fade-in-up">
                    {/* Header */}
                    <div className="transactions-header">
                        <div>
                            <h1>Transactions</h1>
                            <p className="text-muted">Manage all your transactions</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            <i className="bi bi-plus-circle"></i>
                            Add Transaction
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters-card card">
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="btn-toggle"
                            >
                                {showFilters ? 'Hide' : 'Show'}
                                <i className={`bi bi-chevron-${showFilters ? 'up' : 'down'}`}></i>
                            </button>
                        </div>

                        {showFilters && (
                            <div className="filters-content">
                                <div className="filters-grid">
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select
                                            name="type"
                                            value={filters.type}
                                            onChange={handleFilterChange}
                                            className="form-control"
                                        >
                                            <option value="">All Types</option>
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={filters.category}
                                            onChange={handleFilterChange}
                                            className="form-control"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>From Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={filters.startDate}
                                            onChange={handleFilterChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>To Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={filters.endDate}
                                            onChange={handleFilterChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Sort By</label>
                                        <select
                                            name="sort"
                                            value={filters.sort}
                                            onChange={handleFilterChange}
                                            className="form-control"
                                        >
                                            <option value="date-desc">Date (Newest First)</option>
                                            <option value="date-asc">Date (Oldest First)</option>
                                            <option value="amount-desc">Amount (Highest)</option>
                                            <option value="amount-asc">Amount (Lowest)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="filters-actions">
                                    <button onClick={applyFilters} className="btn btn-primary btn-sm">
                                        Apply Filters
                                    </button>
                                    <button onClick={resetFilters} className="btn btn-secondary btn-sm">
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transactions List */}
                    <div className="card">
                        <div className="transactions-list-header">
                            <h3>{transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}</h3>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-inbox empty-state-icon"></i>
                                <p>No transactions found</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-primary"
                                >
                                    Add your first transaction
                                </button>
                            </div>
                        ) : (
                            <div className="transactions-list">
                                {transactions.map(transaction => (
                                    <div key={transaction._id} className="transaction-item">
                                        <div className="transaction-icon">
                                            <i className={`bi bi-${transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}`}></i>
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
                                        <div className="transaction-actions">
                                            <div className={`transaction-amount ${transaction.type}`}>
                                                {transaction.type === 'income' ? '+' : '-'}
                                                XAF {formatCurrency(transaction.amount)}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(transaction._id)}
                                                className="btn-icon-delete"
                                                title="Delete"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Add Transaction Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add Transaction"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleFormChange}
                            className="form-control"
                            required
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Amount (XAF)</label>
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
                        <div className="category-select-group">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                className="form-control"
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
                                className="btn btn-secondary btn-sm"
                            >
                                {showCategoryForm ? 'Cancel' : '+ New'}
                            </button>
                        </div>
                    </div>

                    {showCategoryForm && (
                        <div className="new-category-form">
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ name: e.target.value })}
                                placeholder="Category name"
                                className="form-control"
                            />
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                className="btn btn-primary btn-sm"
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

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Transactions;