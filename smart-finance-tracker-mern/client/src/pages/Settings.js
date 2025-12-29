import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomDropdown from '../components/CustomDropdown';
import { getSettings, updateSettings, resetSettings } from '../services/api';

function Settings() {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({
        theme: 'light',
        currency: 'XAF',
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
            console.error('Load settings error:', error);
            showToast.error('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setSettings({
            ...settings,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSettings({
            ...settings,
            [name]: checked
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateSettings(settings);
            showToast.success('Settings updated successfully');
        } catch (error) {
            console.error('Update settings error:', error);
            showToast.error(error.response?.data?.message || 'Error updating settings');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Reset all settings to default values?')) {
            try {
                setLoading(true);
                const response = await resetSettings();
                if (response.data?.settings) {
                    setSettings(response.data.settings);
                }
                showToast.success('Settings reset to default');
            } catch (error) {
                console.error('Reset settings error:', error);
                showToast.error('Error resetting settings');
            } finally {
                setLoading(false);
            }
        }
    };

    // Dropdown options
    const themeOptions = [
        { value: 'light', label: 'Light Mode' },
        { value: 'dark', label: 'Dark Mode' }
    ];

    const currencyOptions = [
        { value: 'XAF', label: 'XAF - Central African CFA Franc' },
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'NGN', label: 'NGN - Nigerian Naira' },
        { value: 'ZAR', label: 'ZAR - South African Rand' }
    ];

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' }
    ];

    const dateFormatOptions = [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (European)' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
    ];

    const timezoneOptions = [
        { value: 'UTC', label: 'UTC - Universal Time' },
        { value: 'America/New_York', label: 'Eastern Time (US)' },
        { value: 'America/Chicago', label: 'Central Time (US)' },
        { value: 'America/Denver', label: 'Mountain Time (US)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
        { value: 'Europe/London', label: 'London (GMT/BST)' },
        { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
        { value: 'Africa/Douala', label: 'Douala (WAT)' }
    ];

    if (loading && !user) {
        return (
            <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
                <Navbar user={user} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-moss border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary dark:text-neutral-400">Loading settings...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary dark:bg-neutral-900">
            <Navbar user={user} />

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-medium text-accent-cafe dark:text-primary-light">Settings</h1>
                    <p className="text-text-secondary dark:text-neutral-400">Manage your account preferences</p>
                </div>

                <div className="bg-bg-card dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-border-primary dark:border-neutral-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Appearance Section */}
                        <div className="pb-6 border-b border-border-primary dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4 flex items-center gap-2">
                                <i className="bi bi-palette-fill text-primary-moss"></i>
                                Appearance
                            </h3>

                            <div className="space-y-4">
                                <CustomDropdown
                                    label="Theme"
                                    value={settings.theme}
                                    onChange={(val) => handleChange('theme', val)}
                                    options={themeOptions}
                                />
                                <p className="text-xs text-text-muted dark:text-neutral-500 -mt-2">
                                    <i className="bi bi-info-circle mr-1"></i>
                                    Theme is currently managed by the toggle in the navbar
                                </p>
                            </div>
                        </div>

                        {/* Regional Settings Section */}
                        <div className="pb-6 border-b border-border-primary dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4 flex items-center gap-2">
                                <i className="bi bi-globe-americas text-primary-moss"></i>
                                Regional Settings
                            </h3>

                            <div className="space-y-4">
                                <CustomDropdown
                                    label="Currency"
                                    value={settings.currency}
                                    onChange={(val) => handleChange('currency', val)}
                                    options={currencyOptions}
                                />

                                <CustomDropdown
                                    label="Language"
                                    value={settings.language}
                                    onChange={(val) => handleChange('language', val)}
                                    options={languageOptions}
                                />

                                <CustomDropdown
                                    label="Date Format"
                                    value={settings.dateFormat}
                                    onChange={(val) => handleChange('dateFormat', val)}
                                    options={dateFormatOptions}
                                />

                                <CustomDropdown
                                    label="Timezone"
                                    value={settings.timezone}
                                    onChange={(val) => handleChange('timezone', val)}
                                    options={timezoneOptions}
                                />
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div className="pb-6">
                            <h3 className="text-lg font-medium text-primary-kombu dark:text-primary-light mb-4 flex items-center gap-2">
                                <i className="bi bi-bell-fill text-primary-moss"></i>
                                Notifications
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-neutral-700 rounded-lg border border-border-primary dark:border-neutral-600">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-text-primary dark:text-neutral-100">
                                            Enable Notifications
                                        </label>
                                        <p className="text-xs text-text-muted dark:text-neutral-400 mt-1">
                                            Receive notifications about budget alerts and goal milestones
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="notifications"
                                                checked={settings.notifications}
                                                onChange={handleCheckboxChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-moss/20 dark:peer-focus:ring-primary-moss/40 rounded-full peer dark:bg-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-moss"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-primary dark:border-neutral-700">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-kombu dark:bg-primary-moss text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-kombu transition-all duration-300 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle"></i>
                                        <span>Save Settings</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="px-6 py-3 bg-bg-secondary dark:bg-neutral-700 text-text-primary dark:text-neutral-300 rounded-lg hover:bg-border-primary dark:hover:bg-neutral-600 transition-all duration-300 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                <span>Reset to Default</span>
                            </button>
                        </div>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-primary-light/30 dark:bg-neutral-700/50 rounded-lg border border-primary-moss/20 dark:border-primary-moss/30">
                        <div className="flex items-start gap-3">
                            <i className="bi bi-info-circle-fill text-primary-moss dark:text-primary-light text-lg mt-0.5"></i>
                            <div>
                                <h4 className="text-sm font-medium text-primary-kombu dark:text-primary-light mb-1">
                                    About Settings
                                </h4>
                                <p className="text-xs text-text-secondary dark:text-neutral-400 leading-relaxed">
                                    These preferences are saved to your account and will persist across all your devices.
                                    Some settings may require a page refresh to take full effect.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Settings;
