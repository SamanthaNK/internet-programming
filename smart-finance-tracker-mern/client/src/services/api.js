import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth functions
export const register = (name, email, password) => {
    return api.post('/auth/register', { name, email, password });
};

export const login = (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const getMe = () => {
    return api.get('/auth/me');
};

// Transaction functions
export const getTransactions = () => {
    return api.get('/transactions');
};

export const createTransaction = (transactionData) => {
    return api.post('/transactions', transactionData);
};

export const deleteTransaction = (id) => {
    return api.delete(`/transactions/${id}`);
};

export const getSummaryStats = () => {
    return api.get('/transactions/summary');
};

export default api;