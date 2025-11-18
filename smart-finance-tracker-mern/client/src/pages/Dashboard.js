import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import {
    getSummaryStats,
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getCategories,
    createCategory
} from '../services/api';

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
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [newCategory, setNewCategory] = useState({ name: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(userData));
        loadData();
    }, [navigate, selectedPeriod]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [summaryRes, transactionsRes, categoriesRes] = await Promise.all([
                getSummaryStats(selectedPeriod),
                getTransactions({ limit: 5, sort: 'date-desc' }),
                getCategories()
            ]);

            setSummary(summaryRes.data.data);
            setRecentTransactions(transactionsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingTransaction) {
                await updateTransaction(editingTransaction._id, formData);
                toast.success('Transaction updated successfully');
            } else {
                await createTransaction(formData);
                toast.success('Transaction added successfully');
            }

            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setEditingTransaction(null);
            setShowModal(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category._id,
            description: transaction.description || '',
            date: new Date(transaction.transactionDate).toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await deleteTransaction(id);
                toast.success('Transaction deleted');
                loadData();
            } catch (error) {
                toast.error('Error deleting transaction');
            }
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            await createCategory({ name: newCategory.name, type: formData.type });
            toast.success('Category created');
            setNewCategory({ name: '' });
            setShowCategoryForm(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating category');
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            <Navbar user={user} />

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Dashboard</h1>
                        <p className="text-text-secondary dark:text-neutral-400">Your financial overview</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTransaction(null);
                            setFormData({
                                type: 'expense',
                                amount: '',
                                category: '',
                                description: '',
                                date: new Date().toISOString().split('T')[0]
                            });
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all duration-300 shadow-md"
                    >
                        <i className="bi bi-plus-circle"></i>
                        <span>Add Transaction</span>
                    </button>
                </div>

                {/* Period Selector */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-6 border border-border-primary dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4">Time Period</h3>
                    <div className="flex flex-wrap gap-3">
                        {['month', 'year', 'all'].map(period => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-6 py-2 rounded-lg transition-all duration-300 ${selectedPeriod === period
                                    ? 'bg-primary-kombu dark:bg-primary-moss text-white'
                                    : 'bg-bg-secondary dark:bg-neutral-700 text-text-secondary dark:text-neutral-300 hover:bg-bg-overlay dark:hover:bg-neutral-600'
                                    }`}
                            >
                                {period === 'month' ? 'This Month' : period === 'year' ? 'This Year' : 'All Time'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border-l-4 border-accent-sage dark:border-green-600">
                        <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">Total Income</h3>
                        <div className="text-3xl font-serif font-medium text-accent-sage dark:text-green-400 mb-2">
                            {user?.currency || 'XAF'} {formatCurrency(summary.totalIncome)}
                        </div>
                        <p className="text-sm text-text-muted dark:text-neutral-400">{summary.incomeCount || 0} transactions</p>
                    </div>

                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border-l-4 border-accent-terracotta dark:border-red-600">
                        <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">Total Expenses</h3>
                        <div className="text-3xl font-serif font-medium text-accent-terracotta dark:text-red-400 mb-2">
                            {user?.currency || 'XAF'} {formatCurrency(summary.totalExpense)}
                        </div>
                        <p className="text-sm text-text-muted dark:text-neutral-400">{summary.expenseCount || 0} transactions</p>
                    </div>

                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border-l-4 border-accent-seafoam dark:border-blue-600">
                        <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">Balance</h3>
                        <div className="text-3xl font-serif font-medium text-accent-seafoam dark:text-blue-400 mb-2">
                            {user?.currency || 'XAF'} {formatCurrency(summary.balance)}
                        </div>
                        <p className="text-sm text-text-muted dark:text-neutral-400">
                            {selectedPeriod === 'month' ? 'This month' : selectedPeriod === 'year' ? 'This year' : 'All time'}
                        </p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                    <h3 className="text-xl font-medium text-primary-kombu dark:text-primary-light mb-6">Recent Transactions</h3>

                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="bi bi-inbox text-6xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                            <p className="text-text-secondary dark:text-neutral-400">No transactions yet</p>
                            <p className="text-sm text-text-muted dark:text-neutral-500">Add your first transaction to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map(transaction => (
                                <div key={transaction._id} className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-neutral-700 rounded-lg hover:bg-bg-overlay dark:hover:bg-neutral-600 transition-colors border border-border-primary dark:border-neutral-600">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-accent-sage/20 dark:bg-green-900' : 'bg-accent-terracotta/20 dark:bg-red-900'
                                            }`}>
                                            <i className={`bi ${transaction.type === 'income' ? 'bi-arrow-down-circle text-accent-sage dark:text-green-400' : 'bi-arrow-up-circle text-accent-terracotta dark:text-red-400'} text-xl`}></i>
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary dark:text-neutral-100">{transaction.category?.name || 'Uncategorized'}</div>
                                            {transaction.description && (
                                                <div className="text-sm text-text-secondary dark:text-neutral-400">{transaction.description}</div>
                                            )}
                                            <div className="text-xs text-text-muted dark:text-neutral-500">{formatDate(transaction.transactionDate)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-accent-sage dark:text-green-400' : 'text-accent-terracotta dark:text-red-400'}`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {user?.currency || 'XAF'} {formatCurrency(transaction.amount)}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction._id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Transaction Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
                }}
                title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            required
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Amount ({user?.currency || 'XAF'})</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Category</label>
                        <div className="flex space-x-2">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                className="flex-1 px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                                required
                            >
                                <option value="">Select Category</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowCategoryForm(!showCategoryForm)}
                                className="px-4 py-2 bg-bg-secondary dark:bg-neutral-600 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-500 transition-colors"
                            >
                                {showCategoryForm ? 'Cancel' : '+ New'}
                            </button>
                        </div>
                    </div>

                    {showCategoryForm && (
                        <div className="p-4 bg-bg-secondary dark:bg-neutral-700 rounded-lg space-y-2">
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ name: e.target.value })}
                                placeholder="Category name"
                                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-800 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                            >
                                Create Category
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Description (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            placeholder="e.g., Grocery shopping"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}

                    >
                        {loading ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default Dashboard;