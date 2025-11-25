import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showToast } from '../utils/toastConfig';
import { formatCurrency } from '../utils/formatCurrency';
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

  // Filters and UI state
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Data
  const [goals, setGoals] = useState([]);
  const [history, setHistory] = useState([]);

  // Form state
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

  // Load user and initial data
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      navigate('/signin');
      return;
    }
    setUser(JSON.parse(u));
  }, [navigate]);

  useEffect(() => {
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

    if (user) {
      fetchGoals();
      fetchHistory();
    }
  }, [user]);

  // Calculate helpers
  const calcPercent = (g) => {
    const t = Number(g.targetAmount) || 0;
    const c = Number(g.currentAmount) || 0;
    if (t <= 0) return 0;
    return Math.min(100, Math.round((c / t) * 100));
  };

  const monthsBetween = (fromIso, toIso) => {
    if (!fromIso || !toIso) return null;
    const from = new Date(fromIso);
    const to = new Date(toIso);
    const years = to.getFullYear() - from.getFullYear();
    const months = years * 12 + (to.getMonth() - from.getMonth());
    // include partial months if day difference exists
    const adjust = to.getDate() >= from.getDate() ? 0 : -1;
    return Math.max(0, months + adjust);
  };

  const daysRemaining = (deadline) => {
    if (!deadline) return null;
    const end = new Date(deadline);
    const now = new Date();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  };

  const requiredMonthlySavings = (g) => {
    if (!g.deadline) return null;
    const remaining = Math.max(0, Number(g.targetAmount) - Number(g.currentAmount));
    const m = monthsBetween(new Date().toISOString().slice(0, 10), g.deadline);
    if (m === null || m <= 0) return remaining > 0 ? Infinity : 0;
    return remaining / m;
  };

  const estimateCompletionDate = (g) => {
    // Estimate based on pace: currentAmount / elapsedMonths since start
    if (!g.startDate) return null;
    const elapsedMonths = monthsBetween(g.startDate, new Date().toISOString().slice(0, 10));
    const current = Number(g.currentAmount) || 0;
    const target = Number(g.targetAmount) || 0;

    if (elapsedMonths === null || elapsedMonths === 0) return null;
    const monthlyPace = current / elapsedMonths;
    if (monthlyPace <= 0) return null;

    const remaining = Math.max(0, target - current);
    const monthsNeeded = remaining / monthlyPace;

    const start = new Date();
    const estimate = new Date(start.setMonth(start.getMonth() + Math.ceil(monthsNeeded)));
    return estimate.toISOString().slice(0, 10);
  };

  // Notifications on completion
  useEffect(() => {
    goals.forEach(async (g) => {
      const pct = calcPercent(g);
      if (!g.notifiedComplete && pct >= 100) {
        showToast.success(`Goal reached: ${g.title}`);
        try {
          await recordGoalEvent(g._id, { type: 'completed', date: new Date().toISOString() });
          await updateGoal(g._id, { notifiedComplete: true, status: 'completed' });
          // Refresh
          const res = await getGoals();
          setGoals(res.data.data || []);
          const hist = await getGoalHistory();
          setHistory(hist.data.data || []);
        } catch (e) {
          console.error('Record completion error:', e);
        }
      }
    });
  }, [goals]);

  // Templates
  const templates = useMemo(
    () => [
      { key: 'emergency_fund', title: 'Emergency Fund', targetAmount: 300000, notes: '3–6 months of expenses' },
      { key: 'new_laptop', title: 'New Laptop', targetAmount: 500000, notes: 'Engineer-grade device for work' },
      { key: 'tuition', title: 'Tuition', targetAmount: 800000, notes: 'Semester savings plan' },
      { key: 'travel', title: 'Travel', targetAmount: 250000, notes: 'Trip planning fund' },
    ],
    []
  );

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

  // CRUD
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

      const refreshed = await getGoals();
      setGoals(refreshed.data.data || []);
      const hist = await getGoalHistory();
      setHistory(hist.data.data || []);
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
    try {
      await deleteGoal(g._id);
      await recordGoalEvent(g._id, { type: 'deleted', date: new Date().toISOString() });
      showToast.success('Goal deleted');
      const refreshed = await getGoals();
      setGoals(refreshed.data.data || []);
      const hist = await getGoalHistory();
      setHistory(hist.data.data || []);
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
      const refreshed = await getGoals();
      setGoals(refreshed.data.data || []);
      const hist = await getGoalHistory();
      setHistory(hist.data.data || []);
    } catch (e) {
      console.error('Contribution error:', e);
      showToast.error('Failed to record contribution');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
      <Navbar user={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Goals</h1>
            <p className="text-text-secondary dark:text-neutral-400">Create and track savings goals</p>
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
              className="px-4 py-2 border border-border-primary dark:border-neutral-600 rounded-lg bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100 hover:bg-bg-muted dark:hover:bg-neutral-600 transition-all"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>

        {/* Goals list */}
        {loading ? (
          <div className="text-text-secondary dark:text-neutral-400">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="text-text-secondary dark:text-neutral-400">No goals yet. Create your first goal.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((g) => {
              const pct = calcPercent(g);
              const requiredMonthly = requiredMonthlySavings(g);
              const daysLeft = daysRemaining(g.deadline);
              const eta = estimateCompletionDate(g);
              return (
                <div
                  key={g._id}
                  className="p-4 rounded-lg border border-border-primary dark:border-neutral-700 bg-bg-card dark:bg-neutral-800 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary dark:text-neutral-100">{g.title}</h3>
                      <p className="text-sm text-text-secondary dark:text-neutral-400">
                        Target: {formatCurrency(Number(g.targetAmount))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editGoal(g)}
                        className="px-2 py-1 text-sm rounded bg-primary-kombu dark:bg-primary-moss text-white hover:bg-primary-dark"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeGoal(g)}
                        className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full h-2 rounded bg-bg-muted dark:bg-neutral-700">
                      <div
                        className="h-2 rounded bg-primary-kombu dark:bg-primary-moss"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2 text-text-secondary dark:text-neutral-400">
                      <span>
                        Saved: {formatCurrency(Number(g.currentAmount))} ({pct}%)
                      </span>
                      <span>Remaining: {formatCurrency(Math.max(0, Number(g.targetAmount) - Number(g.currentAmount)))}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-secondary dark:text-neutral-400">
                    <div>
                      <span className="block">Start: {g.startDate?.slice(0, 10) || '-'}</span>
                      <span className="block">Deadline: {g.deadline?.slice(0, 10) || '—'}</span>
                    </div>
                    <div>
                      <span className="block">
                        Time left: {g.deadline ? `${daysLeft} days` : '—'}
                      </span>
                      <span className="block">
                        Required monthly: {g.deadline
                          ? requiredMonthly === Infinity
                            ? 'Not possible'
                            : formatCurrency(requiredMonthly)
                          : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block">ETA (pace): {eta || '—'}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Add contribution"
                      className="px-3 py-2 border border-border-primary dark:border-neutral-600 rounded bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number(e.currentTarget.value);
                          if (!isNaN(val) && val > 0) {
                            markContribution(g, val);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        const val = Number(input.value);
                        if (!isNaN(val) && val > 0) {
                          markContribution(g, val);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-2 rounded bg-primary-kombu dark:bg-primary-moss text-white hover:bg-primary-dark"
                    >
                      Add
                    </button>
                  </div>

                  {g.notes ? (
                    <p className="mt-3 text-sm italic text-text-secondary dark:text-neutral-400">{g.notes}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        {showHistory && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-text-primary dark:text-neutral-100 mb-3">Goal history & achievements</h2>
            {history.length === 0 ? (
              <p className="text-text-secondary dark:text-neutral-400">No history yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div
                    key={h._id}
                    className="p-3 rounded border border-border-primary dark:border-neutral-700 bg-bg-card dark:bg-neutral-800 text-sm"
                  >
                    <span className="font-medium">{h.type}</span> — {new Date(h.date).toLocaleString()}
                    {h.meta?.amount ? (
                      <span className="ml-2">({formatCurrency(h.meta.amount)})</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-full max-w-lg p-6 rounded-lg bg-bg-card dark:bg-neutral-800 border border-border-primary dark:border-neutral-700 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary dark:text-neutral-100">
                  {form.goalId ? 'Edit Goal' : 'New Goal'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-2 py-1 rounded bg-bg-muted dark:bg-neutral-700 text-text-secondary dark:text-neutral-300"
                >
                  Close
                </button>
              </div>

              <form onSubmit={save} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Template</label>
                    <select
                      value={form.template}
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                    >
                      <option value="">Select template</option>
                      {templates.map((t) => (
                        <option key={t.key} value={t.key}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                      placeholder="e.g., New Laptop"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Target amount</label>
                    <input
                      type="number"
                      min="1"
                      value={form.targetAmount}
                      onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                      placeholder="e.g., 500000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Current saved</label>
                    <input
                      type="number"
                      min="0"
                      value={form.currentAmount}
                      onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                      placeholder="e.g., 120000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Start date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary dark:text-neutral-400">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                      className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary dark:text-neutral-400">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-border-primary dark:border-neutral-600 bg-bg-card dark:bg-neutral-700 text-text-primary dark:text-neutral-100"
                    rows={3}
                    placeholder="Add context or reminders"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded bg-bg-muted dark:bg-neutral-700 text-text-secondary dark:text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary-kombu dark:bg-primary-moss text-white hover:bg-primary-dark"
                  >
                    {form.goalId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Goals;