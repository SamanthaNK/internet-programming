const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'XAF'],
        default: 'XAF'
    },
    notifications: {
        type: Boolean,
        default: true
    },
    language: {
        type: String,
        enum: ['en', 'fr', 'es'],
        default: 'en'
    },
    dateFormat: {
        type: String,
        enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
        default: 'MM/DD/YYYY'
    },
    timezone: {
        type: String,
        default: 'UTC'
    }
}, {
    timestamps: true
});

// Static method to get or create settings for a user
settingsSchema.statics.getOrCreateSettings = async function(userId) {
    let settings = await this.findOne({ user: userId });
    if (!settings) {
        settings = new this({ user: userId });
        await settings.save();
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);