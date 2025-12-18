const Settings = require('../models/settingsModel');

// Get user settings
const getSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = await Settings.getOrCreateSettings(userId);

        res.json({
            theme: settings.theme,
            currency: settings.currency,
            notifications: settings.notifications,
            language: settings.language,
            dateFormat: settings.dateFormat,
            timezone: settings.timezone
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user settings
const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { theme, currency, notifications, language, dateFormat, timezone } = req.body;

        const settings = await Settings.findOneAndUpdate(
            { user: userId },
            {
                theme,
                currency,
                notifications,
                language,
                dateFormat,
                timezone
            },
            { new: true, upsert: true }
        );

        res.json({
            message: 'Settings updated successfully',
            settings: {
                theme: settings.theme,
                currency: settings.currency,
                notifications: settings.notifications,
                language: settings.language,
                dateFormat: settings.dateFormat,
                timezone: settings.timezone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset settings to default
const resetSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const defaultSettings = {
            theme: 'light',
            currency: 'USD',
            notifications: true,
            language: 'en',
            dateFormat: 'MM/DD/YYYY',
            timezone: 'UTC'
        };

        const settings = await Settings.findOneAndUpdate(
            { user: userId },
            defaultSettings,
            { new: true, upsert: true }
        );

        res.json({
            message: 'Settings reset to default',
            settings: {
                theme: settings.theme,
                currency: settings.currency,
                notifications: settings.notifications,
                language: settings.language,
                dateFormat: settings.dateFormat,
                timezone: settings.timezone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getSettings, updateSettings, resetSettings };