import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to request headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    });

// Handle response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const message = error.response?.data?.message || '';

            if (message.includes('token') || message.includes('authorized')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/session-timeout?reason=timeout';
            }
        }
        return Promise.reject(error);
    }
);

// Auth functions
export const register = (name, email, password, currency = 'XAF') => {
    return api.post('/auth/register', { name, email, password, currency });
};

export const login = (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const getMe = () => {
    return api.get('/auth/me');
};

export const requestPasswordReset = (email) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
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

// Budget APIs
export const getBudgets = (month) => api.get('/budgets', { params: { month } });
export const createBudget = (data) => api.post('/budgets', data);
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
export const getBudgetRecommendations = () => api.get('/budgets/recommendations');

// Template APIs
export const getTemplates = () => api.get('/budgets/templates');
export const createTemplate = (payload) => api.post('/budgets/templates', payload);
export const applyTemplate = (name, month) => api.post(`/budgets/templates/${encodeURIComponent(name)}/apply`, { month });
export const deleteTemplate = (name) => api.delete(`/budgets/templates/${encodeURIComponent(name)}`);

export default api;