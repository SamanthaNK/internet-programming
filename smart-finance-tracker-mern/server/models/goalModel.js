const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Goal title is required'],
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [1, 'Target amount must be positive']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    template: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, 'Notes cannot exceed 500 characters'],
        default: ''
    },
    notifiedComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

goalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);