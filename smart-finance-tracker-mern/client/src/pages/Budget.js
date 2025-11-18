import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCategories, getBudgets, createBudget, updateBudget, deleteBudget } from '../services/api';

function Budget() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ categoryId: '', amount: '', month: month, budgetId: '' });

    const loadCategories = useCallback(async () => {
        try {
            const res = await getCategories('expense');
            setCategories(res.data.data || []);
        } catch (e) { console.error(e); toast.error('Failed to load categories'); }
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await getBudgets(month);
            setBudgets(res.data.data || []);
        } catch (e) { console.error(e); toast.error('Failed to load budgets'); }
    }, [month]);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (!u) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(u));
        fetchData();
        loadCategories();
    }, [fetchData, loadCategories, navigate]);

    const save = async (e) => {
        e.preventDefault();
        try {
            const payload = { categoryId: form.categoryId, amount: parseFloat(form.amount), month: form.month };
            if (form.budgetId) {
                await updateBudget(form.budgetId, payload);
                toast.success('Budget updated');
            } else {
                await createBudget(payload);
                toast.success('Budget created');
            }
            setShowForm(false);
            setForm({ categoryId: '', amount: '', month });
            fetchData();
        } catch (err) { console.error(err); toast.error(err.response?.data?.message || 'Save failed'); }
    };

    const del = async (id) => {
        if (!window.confirm('Delete budget?')) return;
        try { await deleteBudget(id); toast.success('Deleted'); fetchData(); } catch(e){console.error(e); toast.error('Delete failed');}
    };

    return (
        <div>
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
                            onChange={e=>setMonth(e.target.value)}
                            className="px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                            style={{width:180}}
                        />
                        <button className="flex items-center space-x-2 px-5 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark transition-all" onClick={()=>{setShowForm(true); setForm({categoryId:'', amount:'', month, budgetId: ''})}}>
                            <i className="bi bi-plus-circle"></i>
                            <span>New</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-bg-secondary dark:bg-neutral-700 text-text-primary rounded-lg hover:bg-border-primary" onClick={()=>navigate('/transactions?new=1')}>
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
                            <button className="px-3 py-2 bg-bg-secondary dark:bg-neutral-700 rounded-lg text-sm" onClick={()=>{ /* placeholder for export */ }}>Export</button>
                            <button className="px-3 py-2 bg-bg-secondary dark:bg-neutral-700 rounded-lg text-sm" onClick={()=>{ /* placeholder */ }}>Manage Templates</button>
                        </div>
                    </div>
                </div>

                {/* Budgets list container */}
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                    {budgets.length===0 ? (
                        <div className="text-center py-12">
                            <i className="bi bi-inbox text-5xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
                            <p className="text-text-secondary dark:text-neutral-400">No budgets found for this month.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map(b=> (
                                <div key={b.budgetId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-secondary dark:bg-neutral-700 rounded-lg hover:bg-bg-overlay dark:hover:bg-neutral-600 transition-colors border border-border-primary dark:border-neutral-600">
                                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${b.percent>100 ? 'bg-red-200 dark:bg-red-900' : b.percent>=80 ? 'bg-yellow-200 dark:bg-yellow-900' : 'bg-green-200 dark:bg-green-900'}`}>
                                            <i className="bi bi-pie-chart-fill text-xl"></i>
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary dark:text-neutral-100">{b.category || b.categoryName || 'Category'}</div>
                                            <div className="text-sm text-text-secondary dark:text-neutral-400">Spent: {b.spent ?? 0} / {b.limit ?? 0} ({b.percent ?? 0}%)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-48">
                                            <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded h-3 overflow-hidden">
                                                <div className={`h-3 ${b.percent>=80 && b.percent<=100 ? 'bg-yellow-400' : b.percent>100 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100,b.percent||0)}%`}}></div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-2 text-sm border border-border-primary rounded-lg" onClick={()=>{setShowForm(true); setForm({budgetId: b.budgetId, categoryId: b.categoryId, amount: b.limit, month})}}>Edit</button>
                                        <button className="px-3 py-2 text-sm text-red-600 border border-border-primary rounded-lg" onClick={()=>del(b.budgetId)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showForm && (
                    <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 mt-3 border border-border-primary dark:border-neutral-700">
                        <form onSubmit={save}>
                            <div className="mb-2">
                                <label>Category</label>
                                <select className="form-select" value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})} required>
                                    <option value="">Select</option>
                                    {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label>Amount</label>
                                <input className="form-control" type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} required />
                            </div>
                            <div className="mb-2 d-flex justify-content-end">
                                <button className="btn btn-secondary me-2" type="button" onClick={()=>setShowForm(false)}>Cancel</button>
                                <button className="btn btn-primary" type="submit">Save</button>
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
