import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { showToast } from '../utils/toastConfig';
import { formatCurrency } from '../utils/formatCurrency';
import CustomDropdown from '../components/CustomDropdown';
import CustomDatePicker from '../components/CustomDatePicker';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalHistory,
  recordGoalEvent,
} from '../services/api';

function Goals() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [goals, setGoals] = useState([]);
  const [history, setHistory] = useState([]);
  const [contributionAmounts, setContributionAmounts] = useState({});

  const [form, setForm] = useState({
    goalId: '',
    title: '',
    targetAmount: '',
    currentAmount: '',
    startDate: new Date().toISOString().slice(0, 10),
    deadline: '',
    template: '',
    notes: '',
  });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      navigate('/signin');
      return;
    }
    setUser(JSON.parse(u));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchGoals();
      fetchHistory();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals();
      setGoals(res.data.data || []);
    } catch (e) {
      console.error('Fetch goals error:', e);
      showToast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getGoalHistory();
      setHistory(res.data.data || []);
    } catch (e) {
      console.error('Fetch history error:', e);
    }
  };

  const templates = useMemo(
    () => [
      { key: 'emergency_fund', title: 'Emergency Fund', targetAmount: 300000, notes: '3-6 months of expenses' },
      { key: 'new_laptop', title: 'New Laptop', targetAmount: 500000, notes: 'Engineer-grade device for work' },
      { key: 'tuition', title: 'Tuition', targetAmount: 800000, notes: 'Semester savings plan' },
      { key: 'travel', title: 'Travel', targetAmount: 250000, notes: 'Trip planning fund' },
    ],
    []
  );

  const calcPercent = (g) => {
    const t = Number(g.targetAmount) || 0;
    const c = Number(g.currentAmount) || 0;
    if (t <= 0) return 0;
    return Math.min(100, Math.round((c / t) * 100));
  };

  const daysRemaining = (deadline) => {
    if (!deadline) return null;
    const end = new Date(deadline);
    const now = new Date();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const applyTemplate = (key) => {
    const t = templates.find((x) => x.key === key);
    if (!t) return;
    setForm((f) => ({
      ...f,
      template: t.key,
      title: t.title,
      targetAmount: t.targetAmount,
      notes: t.notes,
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title.trim(),
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount),
        startDate: form.startDate,
        deadline: form.deadline || null,
        notes: form.notes?.trim() || '',
        status: form.goalId ? undefined : 'active',
      };

      if (!payload.title || !payload.targetAmount) {
        showToast.error('Title and target amount are required');
        return;
      }

      if (form.goalId) {
        await updateGoal(form.goalId, payload);
        showToast.success('Goal updated');
      } else {
        const res = await createGoal(payload);
        await recordGoalEvent(res.data.data._id, { type: 'created', date: new Date().toISOString() });
        showToast.success('Goal created');
      }

      setShowForm(false);
      setForm({
        goalId: '',
        title: '',
        targetAmount: '',
        currentAmount: '',
        startDate: new Date().toISOString().slice(0, 10),
        deadline: '',
        template: '',
        notes: '',
      });

      fetchGoals();
      fetchHistory();
    } catch (e) {
      console.error('Save goal error:', e);
      showToast.error('Failed to save goal');
    }
  };

  const editGoal = (g) => {
    setShowForm(true);
    setForm({
      goalId: g._id,
      title: g.title || '',
      targetAmount: g.targetAmount?.toString() || '',
      currentAmount: g.currentAmount?.toString() || '',
      startDate: (g.startDate || new Date().toISOString().slice(0, 10)).slice(0, 10),
      deadline: g.deadline ? g.deadline.slice(0, 10) : '',
      template: g.template || '',
      notes: g.notes || '',
    });
  };

  const removeGoal = async (g) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal(g._id);
      await recordGoalEvent(g._id, { type: 'deleted', date: new Date().toISOString() });
      showToast.success('Goal deleted');
      fetchGoals();
      fetchHistory();
    } catch (e) {
      console.error('Delete goal error:', e);
      showToast.error('Failed to delete goal');
    }
  };

  const markContribution = async (g, amount) => {
    try {
      const newAmount = Math.max(0, Number(g.currentAmount) + Number(amount));
      await updateGoal(g._id, { currentAmount: newAmount });
      await recordGoalEvent(g._id, {
        type: 'contribution',
        date: new Date().toISOString(),
        meta: { amount: Number(amount) },
      });
      showToast.success('Contribution recorded');
      fetchGoals();
      fetchHistory();
      setContributionAmounts({ ...contributionAmounts, [g._id]: '' });
    } catch (e) {
      console.error('Contribution error:', e);
      showToast.error('Failed to record contribution');
    }
  };

  useEffect(() => {
    goals.forEach(async (g) => {
      const pct = calcPercent(g);
      if (!g.notifiedComplete && pct >= 100) {
        showToast.success(`Goal reached: ${g.title}`);
        try {
          await recordGoalEvent(g._id, { type: 'completed', date: new Date().toISOString() });
          await updateGoal(g._id, { notifiedComplete: true, status: 'completed' });
          fetchGoals();
          fetchHistory();
        } catch (e) {
          console.error('Record completion error:', e);
        }
      }
    });
  }, [goals]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
        <Navbar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-moss border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary dark:text-neutral-400">Loading goals...</p>
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
            <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Financial Goals</h1>
            <p className="text-text-secondary dark:text-neutral-400">Track and achieve your savings targets</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowForm(true);
                setForm({
                  goalId: '',
                  title: '',
                  targetAmount: '',
                  currentAmount: '',
                  startDate: new Date().toISOString().slice(0, 10),
                  deadline: '',
                  template: '',
                  notes: '',
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all shadow-md hover:shadow-lg"
            >
              <i className="bi bi-plus-circle"></i>
              <span>New Goal</span>
            </button>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 hover:bg-bg-secondary dark:hover:bg-neutral-600 transition-all"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-12 border border-border-primary dark:border-neutral-700 text-center">
            <i className="bi bi-bullseye text-6xl text-border-primary dark:text-neutral-600 mb-4 block"></i>
            <h3 className="text-xl font-medium text-text-primary dark:text-neutral-100 mb-2">
              No goals yet
            </h3>
            <p className="text-text-secondary dark:text-neutral-400 mb-6">
              Start tracking your financial goals and watch your progress
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors shadow-md hover:shadow-lg"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((g) => {
              const pct = calcPercent(g);
              const daysLeft = daysRemaining(g.deadline);
              const remaining = Math.max(0, Number(g.targetAmount) - Number(g.currentAmount));

              return (
                <div
                  key={g._id}
                  className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary dark:text-neutral-100 mb-1">{g.title}</h3>
                      <p className="text-sm text-text-secondary dark:text-neutral-400">
                        Target: {formatCurrency(Number(g.targetAmount), user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editGoal(g)}
                        className="p-2 text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => removeGoal(g)}
                        className="p-2 text-text-secondary dark:text-neutral-400 hover:text-primary-kombu dark:hover:text-neutral-200 transition-colors"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full h-3 rounded-full bg-bg-secondary dark:bg-neutral-700 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-accent-sage dark:bg-green-500' :
                          pct >= 80 ? 'bg-yellow-500' :
                            'bg-primary-moss'
                          }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2 text-text-secondary dark:text-neutral-400">
                      <span>
                        Saved: {formatCurrency(Number(g.currentAmount), user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''} ({pct}%)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-text-secondary dark:text-neutral-400">
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-medium text-text-primary dark:text-neutral-100">
                        {formatCurrency(remaining, user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                      </span>
                    </div>
                    {g.deadline && (
                      <div className="flex justify-between">
                        <span>Time left:</span>
                        <span className="font-medium text-text-primary dark:text-neutral-100">{daysLeft} days</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Start date:</span>
                      <span>{g.startDate?.slice(0, 10) || '-'}</span>
                    </div>
                    {g.deadline && (
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span>{g.deadline.slice(0, 10)}</span>
                      </div>
                    )}
                  </div>

                  {pct < 100 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="100.00"
                        placeholder="Add amount"
                        value={contributionAmounts[g._id] || ''}
                        onChange={(e) => setContributionAmounts({ ...contributionAmounts, [g._id]: e.target.value })}
                        className="flex-1 px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const val = Number(contributionAmounts[g._id]);
                          if (!isNaN(val) && val > 0) {
                            markContribution(g, val);
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-primary-kombu dark:bg-primary-moss text-white hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  {g.notes && (
                    <p className="mt-4 pt-4 border-t border-border-primary dark:border-neutral-700 text-sm italic text-text-secondary dark:text-neutral-400">
                      {g.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showHistory && (
          <div className="mt-8 bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
            <h2 className="text-xl font-medium text-primary-kombu dark:text-primary-light mb-4">Goal History</h2>
            {history.length === 0 ? (
              <p className="text-text-secondary dark:text-neutral-400 text-center py-8">No history yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div
                    key={h._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary dark:bg-neutral-700 border border-border-primary dark:border-neutral-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.type === 'completed' ? 'bg-accent-sage/20 dark:bg-green-900' :
                        h.type === 'contribution' ? 'bg-primary-light dark:bg-primary-moss/20' :
                          'bg-bg-overlay dark:bg-neutral-600'
                        }`}>
                        <i className={`bi ${h.type === 'completed' ? 'bi-check-circle text-accent-sage dark:text-green-400' :
                          h.type === 'contribution' ? 'bi-plus-circle text-primary-moss' :
                            h.type === 'created' ? 'bi-flag text-primary-kombu dark:text-primary-light' :
                              'bi-x-circle text-accent-terracotta dark:text-red-400'
                          }`}></i>
                      </div>
                      <div>
                        <span className="font-medium text-text-primary dark:text-neutral-100 capitalize">{h.type.replace('_', ' ')}</span>
                        {h.meta?.amount && (
                          <span className="ml-2 text-sm text-text-secondary dark:text-neutral-400">
                            +{formatCurrency(h.meta.amount, user?.currency || 'XAF')} {user?.currency === 'XAF' ? 'frs' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-text-muted dark:text-neutral-500">
                      {new Date(h.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={form.goalId ? 'Edit Goal' : 'New Goal'}
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <CustomDropdown
              label="Template (Optional)"
              value={form.template}
              onChange={(key) => applyTemplate(key)}
              options={[
                { value: '', label: 'Select a template' },
                ...templates.map(t => ({ value: t.key, label: t.title }))
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Goal Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
              placeholder="e.g., New Laptop"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Target Amount</label>
              <input
                type="number"
                min="1"
                value={form.targetAmount}
                onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                placeholder="500000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Current Amount</label>
              <input
                type="number"
                min="0"
                value={form.currentAmount}
                onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
                className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomDatePicker
              label="Start Date"
              value={form.startDate}
              onChange={(val) => setForm((f) => ({ ...f, startDate: val }))}
            />
            <CustomDatePicker
              label="Deadline"
              value={form.deadline}
              onChange={(val) => setForm((f) => ({ ...f, deadline: val }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-neutral-300 mb-2">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 focus:ring-2 focus:ring-primary-moss focus:border-transparent"
              rows={3}
              placeholder="Add context or reminders"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-colors"
            >
              {form.goalId ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Goals;