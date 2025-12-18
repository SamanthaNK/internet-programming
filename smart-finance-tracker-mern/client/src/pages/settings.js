import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSettings, updateSettings, resetSettings } from '../services/api';

function Settings() {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({
        theme: 'light',
        currency: 'USD',
        notifications: true,
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'UTC'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/signin');
            return;
        }
        setUser(JSON.parse(userData));
        loadSettings();
    }, [navigate]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await getSettings();
            if (response.data) {
                setSettings(response.data);
            }
        } catch (error) {
            showToast.error('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateSettings(settings);
            showToast.success('Settings updated successfully');
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Error updating settings');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Reset settings to default?')) {
            try {
                setLoading(true);
                await resetSettings();
                showToast.success('Settings reset to default');
                loadSettings();
            } catch (error) {
                showToast.error('Error resetting settings');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-bg-primary dark:bg-neutral-900">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-sage dark:border-green-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary dark:bg-neutral-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                    <h1 className="text-2xl font-bold text-primary-kombu dark:text-primary-light mb-6">Settings</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-light mb-2">
                                Theme
                            </label>
                            <select
                                name="theme"
                                value={settings.theme}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-accent-sage focus:border-accent-sage dark:bg-neutral-700 dark:text-text-light"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-light mb-2">
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-accent-sage focus:border-accent-sage dark:bg-neutral-700 dark:text-text-light"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="XAF">XAF</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-light mb-2">
                                Language
                            </label>
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-accent-sage focus:border-accent-sage dark:bg-neutral-700 dark:text-text-light"
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-light mb-2">
                                Date Format
                            </label>
                            <select
                                name="dateFormat"
                                value={settings.dateFormat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-accent-sage focus:border-accent-sage dark:bg-neutral-700 dark:text-text-light"
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-light mb-2">
                                Timezone
                            </label>
                            <select
                                name="timezone"
                                value={settings.timezone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-primary dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-accent-sage focus:border-accent-sage dark:bg-neutral-700 dark:text-text-light"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Chicago">Central Time</option>
                                <option value="America/Denver">Mountain Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Europe/Paris">Paris</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={settings.notifications}
                                onChange={handleChange}
                                className="h-4 w-4 text-accent-sage focus:ring-accent-sage border-border-primary rounded"
                            />
                            <label className="ml-2 block text-sm text-text-primary dark:text-text-light">
                                Enable Notifications
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-accent-sage hover:bg-primary-kombu text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-sage focus:ring-offset-2 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="bg-accent-terracotta hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-terracotta focus:ring-offset-2 disabled:opacity-50 transition-colors"
                            >
                                Reset to Default
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Settings;
