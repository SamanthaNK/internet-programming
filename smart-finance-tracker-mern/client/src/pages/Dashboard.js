import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
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
    createCategory,
    getBudgets
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
    const [budgets, setBudgets] = useState([]);
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
            const currentMonth = new Date().toISOString().slice(0, 7);
            const [summaryRes, transactionsRes, categoriesRes, budgetsRes] = await Promise.all([
                getSummaryStats(selectedPeriod),
                getTransactions({ limit: 5, sort: 'date-desc' }),
                getCategories(),
                getBudgets(currentMonth)
            ]);

            setSummary(summaryRes.data.data);
            setRecentTransactions(transactionsRes.data.data);
            setCategories(categoriesRes.data.data);
            setBudgets(budgetsRes.data.data || []);
        } catch (error) {
            showToast.error('Error loading data');
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
                showToast.success('Transaction updated successfully');
            } else {
                await createTransaction(formData);
                showToast.success('Transaction added successfully');
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
            showToast.error(error.response?.data?.message || 'Error saving transaction');
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
                showToast.success('Transaction deleted');
                loadData();
            } catch (error) {
                showToast.error('Error deleting transaction');
            }
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            await createCategory({ name: newCategory.name, type: formData.type });
            showToast.success('Category created');
            setNewCategory({ name: '' });
            setShowCategoryForm(false);
            loadData();
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Error creating category');
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

    const savingsRate = summary.totalIncome > 0
        ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
        : 0;

    // Get total budget and spent
    const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    const budgetProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    if (loading && !summary.totalIncome && !summary.totalExpense) {
        return (
            <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
                <Navbar user={user} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-moss border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary dark:text-neutral-400">Loading dashboard...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            <Navbar user={user} />

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p className="text-text-secondary dark:text-neutral-400">Here's your financial overview</p>
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
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <i className="bi bi-plus-circle"></i>
                        <span>Add Transaction</span>
                    </button>
                </div>

                {/* Period Selector */}
                <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl shadow-md p-6 mb-6 border border-white/20 dark:border-neutral-700/50">
                    <div className="flex flex-wrap items-center gap-3">
                        {['month', 'year', 'all'].map(period => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-6 py-2 rounded-lg transition-all duration-300 ${selectedPeriod === period
                                    ? 'bg-primary-kombu dark:bg-primary-moss text-white shadow-md'
                                    : 'bg-white/60 dark:bg-neutral-700/60 text-text-secondary dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {period === 'month' ? 'This Month' : period === 'year' ? 'This Year' : 'All Time'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Income */}
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-sage/30 to-accent-sage/10 dark:from-green-900/30 dark:to-green-900/10"></div>
                        <div className="relative bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/20 dark:border-neutral-700/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase font-medium">Total Income</h3>
                                <div className="p-2 bg-accent-sage/20 dark:bg-green-900/30 rounded-lg">
                                    <i className="bi bi-arrow-down-circle text-accent-sage dark:text-green-400 text-xl"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-serif font-medium text-accent-sage dark:text-green-400 mb-2">
                                {user?.currency || 'XAF'} {formatCurrency(summary.totalIncome)}
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 flex items-center gap-2">
                                <i className="bi bi-receipt"></i>
                                {summary.incomeCount || 0} transactions
                            </p>
                        </div>
                    </div>

                    {/* Total Expenses */}
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-terracotta/30 to-accent-terracotta/10 dark:from-red-900/30 dark:to-red-900/10"></div>
                        <div className="relative bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/20 dark:border-neutral-700/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase font-medium">Total Expenses</h3>
                                <div className="p-2 bg-accent-terracotta/20 dark:bg-red-900/30 rounded-lg">
                                    <i className="bi bi-arrow-up-circle text-accent-terracotta dark:text-red-400 text-xl"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-serif font-medium text-accent-terracotta dark:text-red-400 mb-2">
                                {user?.currency || 'XAF'} {formatCurrency(summary.totalExpense)}
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 flex items-center gap-2">
                                <i className="bi bi-receipt"></i>
                                {summary.expenseCount || 0} transactions
                            </p>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-seafoam/30 to-accent-seafoam/10 dark:from-blue-900/30 dark:to-blue-900/10"></div>
                        <div className="relative bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/20 dark:border-neutral-700/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase font-medium">Balance</h3>
                                <div className="p-2 bg-accent-seafoam/20 dark:bg-blue-900/30 rounded-lg">
                                    <i className="bi bi-wallet2 text-accent-seafoam dark:text-blue-400 text-xl"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-serif font-medium text-accent-seafoam dark:text-blue-400 mb-2">
                                {user?.currency || 'XAF'} {formatCurrency(summary.balance)}
                            </div>
                            <p className="text-sm text-text-muted dark:text-neutral-400 flex items-center gap-2">
                                <i className="bi bi-graph-up-arrow"></i>
                                {selectedPeriod === 'month' ? 'This month' : selectedPeriod === 'year' ? 'This year' : 'All time'}
                            </p>
                        </div>
                    </div>

                    {/* Savings Rate */}
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-moss/30 to-primary-moss/10 dark:from-primary-moss/30 dark:to-primary-moss/10"></div>
                        <div className="relative bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/20 dark:border-neutral-700/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase font-medium">Savings Rate</h3>
                                <div className="p-2 bg-primary-moss/20 dark:bg-primary-moss/30 rounded-lg">
                                    <i className="bi bi-piggy-bank text-primary-moss dark:text-primary-light text-xl"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-serif font-medium text-primary-moss dark:text-primary-light mb-2">
                                {savingsRate}%
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded-full h-2 mt-3">
                                <div
                                    className="bg-primary-moss dark:bg-primary-light h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, savingsRate)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Budget Overview */}
                    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20 dark:border-neutral-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light flex items-center gap-2">
                                <i className="bi bi-pie-chart-fill text-primary-moss"></i>
                                Budget Overview
                            </h3>
                            <button
                                onClick={() => navigate('/budgets')}
                                className="text-sm text-primary-moss dark:text-primary-light hover:underline"
                            >
                                View all →
                            </button>
                        </div>

                        {budgets.length === 0 ? (
                            <div className="text-center py-8">
                                <i className="bi bi-pie-chart text-4xl text-border-primary dark:text-neutral-600 mb-3 block"></i>
                                <p className="text-text-secondary dark:text-neutral-400 mb-3">No budgets set yet</p>
                                <button
                                    onClick={() => navigate('/budgets')}
                                    className="px-4 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                                >
                                    Create Budget
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary dark:text-neutral-400">Total Spent</span>
                                    <span className="text-lg font-semibold text-primary-kombu dark:text-primary-light">
                                        {user?.currency || 'XAF'} {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${budgetProgress > 100 ? 'bg-red-500' :
                                            budgetProgress >= 80 ? 'bg-yellow-400' :
                                                'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(100, budgetProgress)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-text-muted dark:text-neutral-400">
                                    {budgetProgress}% of budget used • {budgets.length} categories
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20 dark:border-neutral-700/50">
                        <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4 flex items-center gap-2">
                            <i className="bi bi-lightning-fill text-primary-moss"></i>
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/transactions')}
                                className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-all border border-border-primary dark:border-neutral-600"
                            >
                                <i className="bi bi-list-ul text-2xl text-primary-moss mb-2"></i>
                                <span className="text-sm text-text-primary dark:text-neutral-100">Transactions</span>
                            </button>
                            <button
                                onClick={() => navigate('/budgets')}
                                className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-all border border-border-primary dark:border-neutral-600"
                            >
                                <i className="bi bi-pie-chart-fill text-2xl text-primary-moss mb-2"></i>
                                <span className="text-sm text-text-primary dark:text-neutral-100">Budgets</span>
                            </button>
                            <button
                                onClick={() => navigate('/reports')}
                                className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-all border border-border-primary dark:border-neutral-600"
                            >
                                <i className="bi bi-graph-up text-2xl text-primary-moss mb-2"></i>
                                <span className="text-sm text-text-primary dark:text-neutral-100">Reports</span>
                            </button>
                            <button
                                onClick={() => navigate('/goals')}
                                className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-all border border-border-primary dark:border-neutral-600"
                            >
                                <i className="bi bi-bullseye text-2xl text-primary-moss mb-2"></i>
                                <span className="text-sm text-text-primary dark:text-neutral-100">Goals</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20 dark:border-neutral-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-medium text-primary-kombu dark:text-primary-light flex items-center gap-2">
                            <i className="bi bi-clock-history text-primary-moss"></i>
                            Recent Transactions
                        </h3>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="text-sm text-primary-moss dark:text-primary-light hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="bi bi-inbox text-6xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                            <p className="text-text-secondary dark:text-neutral-400 mb-4">No transactions yet</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Add your first transaction
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map(transaction => (
                                <div
                                    key={transaction._id}
                                    className="flex items-center justify-between p-4 bg-white/60 dark:bg-neutral-700/60 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors border border-border-primary dark:border-neutral-600"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'income'
                                            ? 'bg-accent-sage/20 dark:bg-green-900'
                                            : 'bg-accent-terracotta/20 dark:bg-red-900'
                                            }`}>
                                            <i className={`bi ${transaction.type === 'income'
                                                ? 'bi-arrow-down-circle text-accent-sage dark:text-green-400'
                                                : 'bi-arrow-up-circle text-accent-terracotta dark:text-red-400'
                                                } text-xl`}></i>
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary dark:text-neutral-100">
                                                {transaction.category?.name || 'Uncategorized'}
                                            </div>
                                            {transaction.description && (
                                                <div className="text-sm text-text-secondary dark:text-neutral-400">
                                                    {transaction.description}
                                                </div>
                                            )}
                                            <div className="text-xs text-text-muted dark:text-neutral-500">
                                                {formatDate(transaction.transactionDate)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className={`text-lg font-semibold ${transaction.type === 'income'
                                            ? 'text-accent-sage dark:text-green-400'
                                            : 'text-accent-terracotta dark:text-red-400'
                                            }`}>
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
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">
                            Amount ({user?.currency || 'XAF'})
                        </label>
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
                                className="w-full px-4 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors"
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
                        <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                            placeholder="e.g., Grocery shopping"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(false);
                                setEditingTransaction(null);
                            }}
                            className="flex-1 px-6 py-3 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : editingTransaction ? 'Update' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Dashboard;