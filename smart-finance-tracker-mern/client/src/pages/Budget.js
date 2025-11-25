import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import { formatCurrency } from '../utils/formatCurrency';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCategories, getBudgets, createBudget, updateBudget, deleteBudget, getBudgetSuggestions } from '../services/api';

function Budget() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ categoryId: '', amount: '', month: month, budgetId: '' });
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (!u) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(u));
        loadCategories();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            fetchBudgets();
            loadAISuggestions();
        }
    }, [month, user]);

    const loadCategories = async () => {
        try {
            const res = await getCategories('expense');
            setCategories(res.data.data || []);
        } catch (e) {
            console.error('Load categories error:', e);
            showToast.error('Failed to load categories');
        }
    };

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const res = await getBudgets(month);
            setBudgets(res.data.data || []);
        } catch (e) {
            console.error('Fetch budgets error:', e);
            showToast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const loadAISuggestions = async () => {
        try {
            setLoadingAI(true);
            const response = await getBudgetSuggestions();

            if (response.data.success) {
                setAiSuggestions(response.data.data.suggestions);
            }
        } catch (error) {
            console.error('AI Suggestions Error:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const save = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                categoryId: form.categoryId,
                amount: parseFloat(form.amount),
                month: form.month
            };

            if (form.budgetId) {
                await updateBudget(form.budgetId, payload);
                showToast.success('Budget updated');
            } else {
                await createBudget(payload);
                showToast.success('Budget created');
            }
            setShowForm(false);
            setForm({ categoryId: '', amount: '', month, budgetId: '' });

            // Reload budgets after save
            const res = await getBudgets(month);
            setBudgets(res.data.data || []);
        } catch (err) {
            console.error('Save budget error:', err);
            showToast.error(err.response?.data?.message || 'Save failed');
        }
    };

    const del = async (id) => {
        if (!window.confirm('Delete budget?')) return;
        try {
            await deleteBudget(id);
            showToast.success('Deleted');

            // Reload budgets after delete
            const res = await getBudgets(month);
            setBudgets(res.data.data || []);
        } catch (e) {
            console.error('Delete budget error:', e);
            showToast.error('Delete failed');
        }
    };

    const getTotalBudget = () => {
        return budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
    };

    const getTotalSpent = () => {
        return budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    };

    const getOverallProgress = () => {
        const total = getTotalBudget();
        const spent = getTotalSpent();
        return total > 0 ? Math.round((spent / total) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
                <Navbar user={user} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-moss border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary dark:text-neutral-400">Loading budgets...</p>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Budgets</h1>
                        <p className="text-text-secondary dark:text-neutral-400">Plan monthly budgets by category</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                        />
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setForm({ categoryId: '', amount: '', month, budgetId: '' });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all shadow-md hover:shadow-lg"
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>New Budget</span>
                        </button>
                        <button
                            onClick={() => navigate('/transactions?new=1')}
                            className="flex items-center gap-2 px-4 py-2 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-100 rounded-lg hover:bg-bg-overlay dark:hover:bg-neutral-600 transition-all border border-border-primary dark:border-neutral-600"
                        >
                            <i className="bi bi-receipt"></i>
                            <span>Add Transaction</span>
                        </button>
                    </div>
                </div>

                {/* Header controls card (templates, save) */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-6 border border-border-primary dark:border-neutral-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-text-secondary dark:text-neutral-400">Month:</div>
                            <div className="text-sm font-medium">{month}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-2 bg-bg-secondary dark:bg-neutral-700 rounded-lg text-sm" onClick={() => { /* placeholder for export */ }}>Export</button>
                            <button className="px-3 py-2 bg-bg-secondary dark:bg-neutral-700 rounded-lg text-sm" onClick={() => { /* placeholder */ }}>Manage Templates</button>
                        </div>
                    </div>
                </div>

                {/* AI Budget Suggestions */}
                {aiSuggestions.length > 0 && showSuggestions && (
                    <div className="bg-gradient-to-r from-primary-light/50 to-accent-seafoam/30 dark:from-neutral-800/50 dark:to-neutral-700/50 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 border border-primary-moss/20 dark:border-primary-moss/30">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-moss to-accent-sage rounded-lg flex items-center justify-center">
                                    <i className="bi bi-robot text-xl text-white"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light">
                                        AI Budget Recommendations
                                    </h3>
                                    <p className="text-xs text-text-muted dark:text-neutral-500">
                                        Based on your spending patterns
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSuggestions(false)}
                                className="text-text-muted dark:text-neutral-500 hover:text-text-secondary dark:hover:text-neutral-400 transition-colors"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {loadingAI ? (
                            <div className="flex items-center gap-2 text-text-secondary dark:text-neutral-400">
                                <div className="w-4 h-4 border-2 border-primary-moss border-t-transparent rounded-full animate-spin"></div>
                                <span>Analyzing your budgets...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {aiSuggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-neutral-700/60 rounded-lg">
                                        <i className="bi bi-check-circle-fill text-accent-sage dark:text-green-400 text-lg flex-shrink-0 mt-0.5"></i>
                                        <p className="text-sm text-text-secondary dark:text-neutral-400 leading-relaxed">
                                            {suggestion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={loadAISuggestions}
                            className="mt-4 text-sm text-primary-moss dark:text-primary-light hover:underline flex items-center gap-1"
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            <span>Refresh suggestions</span>
                        </button>
                    </div>
                )}

                {/* Overall Summary */}
                {budgets.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Total Budget
                            </h3>
                            <div className="text-3xl font-serif font-medium text-primary-kombu dark:text-primary-light">
                                {formatCurrency(getTotalBudget(), user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                            </div>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Total Spent
                            </h3>
                            <div className="text-3xl font-serif font-medium text-accent-terracotta dark:text-red-400">
                                {formatCurrency(getTotalSpent(), user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                            </div>
                        </div>

                        <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow">
                            <h3 className="text-sm text-text-secondary dark:text-neutral-400 uppercase mb-2 font-medium">
                                Remaining
                            </h3>
                            <div className="text-3xl font-serif font-medium text-primary-moss dark:text-green-400">
                                {formatCurrency(Math.max(0, getTotalBudget() - getTotalSpent()), user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                            </div>
                            <div className="mt-3">
                                <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${getOverallProgress() > 100 ? 'bg-red-500' :
                                            getOverallProgress() >= 80 ? 'bg-yellow-400' :
                                                'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(100, getOverallProgress())}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-text-muted dark:text-neutral-500 mt-1">
                                    {getOverallProgress()}% of total budget used
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Budgets list container */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                    {budgets.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="bi bi-inbox text-5xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                            <p className="text-text-secondary dark:text-neutral-400">No budgets found for this month.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map(b => (
                                <div key={b.budgetId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-secondary dark:bg-neutral-700 rounded-lg hover:bg-bg-overlay dark:hover:bg-neutral-600 transition-colors border border-border-primary dark:border-neutral-600">
                                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${b.percent > 100 ? 'bg-red-200 dark:bg-red-900' : b.percent >= 80 ? 'bg-yellow-200 dark:bg-yellow-900' : 'bg-green-200 dark:bg-green-900'}`}>
                                            <i className="bi bi-pie-chart-fill text-xl"></i>
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary dark:text-neutral-100">{b.category || b.categoryName || 'Category'}</div>
                                            <div className="text-sm text-text-secondary dark:text-neutral-400">
                                                Spent: {formatCurrency(b.spent ?? 0, user?.currency || 'XAF')} / {formatCurrency(b.limit ?? 0, user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''} ({b.percent ?? 0}%)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-48">
                                            <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded h-3 overflow-hidden">
                                                <div className={`h-3 ${b.percent >= 80 && b.percent <= 100 ? 'bg-yellow-400' : b.percent > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, b.percent || 0)}%` }}></div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-2 text-sm border border-border-primary rounded-lg" onClick={() => { setShowForm(true); setForm({ budgetId: b.budgetId, categoryId: b.categoryId, amount: b.limit, month }) }}>Edit</button>
                                        <button className="px-3 py-2 text-sm text-red-600 border border-border-primary rounded-lg" onClick={() => del(b.budgetId)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showForm && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 mt-3 border border-border-primary dark:border-neutral-700">
                        <form onSubmit={save}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                                        value={form.categoryId}
                                        onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Amount ({user?.currency || 'XAF'})</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border-primary dark:border-neutral-600 bg-bg-secondary dark:bg-neutral-700 text-text-secondary dark:text-neutral-300">{user?.currency || 'XAF'}</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={form.amount}
                                            onChange={e => setForm({ ...form, amount: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-r-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-text-muted dark:text-neutral-500 mt-2">Set the monthly limit for this category. You can edit it later.</p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-bg-secondary dark:bg-neutral-700 text-text-primary rounded-lg hover:bg-border-primary">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark">Save Budget</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Budget;