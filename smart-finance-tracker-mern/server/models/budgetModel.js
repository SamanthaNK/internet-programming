const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    month: {
        type: String, // YYYY-MM
        required: function() { return !this.isTemplate; }
    },
    isTemplate: {
        type: Boolean,
        default: false
    },
    templateName: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
