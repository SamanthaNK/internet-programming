import axios from 'axios';
import sessionManager from '../utils/sessionManager';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to request headers and update activity
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        sessionManager.updateActivity();
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    });

// Handle response errors globally
api.interceptors.response.use(
    (response) => {
        // Update activity on successful response
        sessionManager.updateActivity();
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const message = error.response?.data?.message || '';

            if (message.includes('token') || message.includes('authorized')) {
                sessionManager.logout();
                window.location.href = '/session-timeout?reason=unauthorized';
            }
        }
        return Promise.reject(error);
    }
);

// Auth functions
export const register = (name, email, password, currency = 'XAF') => {
    return api.post('/auth/register', { name, email, password, currency });
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    // Store login timestamp and initialize session tracking
    if (response.data.success && response.data.loginTimestamp) {
        sessionManager.setLoginTimestamp(response.data.loginTimestamp);
    }

    return response;
};

export const getMe = () => {
    return api.get('/auth/me');
};

export const requestPasswordReset = (email) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });

    // Initialize session tracking after password reset (auto-login)
    if (response.data.success && response.data.loginTimestamp) {
        sessionManager.setLoginTimestamp(response.data.loginTimestamp);
    }

    return response;
};

// Category functions
export const getCategories = (type) => {
    return api.get('/categories', { params: type ? { type } : {} });
};

export const createCategory = (categoryData) => {
    return api.post('/categories', categoryData);
};

// Transaction functions
export const getTransactions = (filters = {}) => {
    return api.get('/transactions', { params: filters });
};

export const createTransaction = (transactionData) => {
    return api.post('/transactions', transactionData);
};

export const updateTransaction = (id, transactionData) => {
    return api.put(`/transactions/${id}`, transactionData);
};

export const deleteTransaction = (id) => {
    return api.delete(`/transactions/${id}`);
};

export const getSummaryStats = (period = 'month') => {
    return api.get('/transactions/summary', { params: { period } });
};

// Report functions
export const getMonthlyReport = (year) => {
    return api.get('/reports/monthly', { params: year ? { year } : {} });
};

export const getCategoryBreakdown = (period = 'month', type = 'expense') => {
    return api.get('/reports/category', { params: { period, type } });
};

export const getSpendingTrends = (period = 'month', groupBy = 'day') => {
    return api.get('/reports/trends', { params: { period, groupBy } });
};

export const getComparisonReport = () => {
    return api.get('/reports/comparison');
};

export const getTopCategories = (period = 'month', limit = 5) => {
    return api.get('/reports/top-categories', { params: { period, limit } });
};

export const getSpendingByDayOfWeek = (period = 'month') => {
    return api.get('/reports/day-of-week', { params: { period } });
};

// Budget functions
export const getBudgets = (month) => {
    return api.get('/budgets', { params: month ? { month } : {} });
};
export const createBudget = (data) => {
    return api.post('/budgets', data);
};

export const updateBudget = (id, data) => {
    return api.put(`/budgets/${id}`, data);
};

export const deleteBudget = (id) => {
    return api.delete(`/budgets/${id}`);
};

export const getBudgetRecommendations = () => {
    return api.get('/budgets/recommendations');
};

// Goals functions
export const getGoals = (status) => {
    return api.get('/goals', { params: status ? { status } : {} });
};

export const createGoal = (goalData) => {
    return api.post('/goals', goalData);
};

export const updateGoal = (id, goalData) => {
    return api.put(`/goals/${id}`, goalData);
};

export const deleteGoal = (id) => {
    return api.delete(`/goals/${id}`);
};

export const getGoalHistory = (goalId) => {
    return api.get('/goals/history', { params: goalId ? { goalId } : {} });
};

export const recordGoalEvent = (goalId, eventData) => {
    return api.post('/goals/history', { goalId, ...eventData });
};

// Export functions
export const exportTransactionsCSV = async (filters = {}) => {
    const response = await api.get('/export/csv', {
        params: filters,
        responseType: 'blob'
    });
    return response;
};

export const exportTransactionsPDF = async (filters = {}) => {
    const response = await api.get('/export/pdf', {
        params: filters,
        responseType: 'blob'
    });
    return response;
};

// AI functions
export const getDashboardTip = () => {
    return api.get('/ai/dashboard-tip');
};

export const getBudgetSuggestions = () => {
    return api.get('/ai/budget-suggestions');
};

export const getSpendingInsights = (period = 'month') => {
    return api.get('/ai/spending-insights', { params: { period } });
};

export const getSpendingAlerts = () => {
    return api.get('/ai/spending-alerts');
};

export default api;