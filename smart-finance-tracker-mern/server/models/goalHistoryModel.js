const mongoose = require('mongoose');

const goalHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true
    },
    type: {
        type: String,
        enum: ['created', 'contribution', 'completed', 'cancelled', 'deleted', 'milestone'],
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

goalHistorySchema.index({ userId: 1, goalId: 1, date: -1 });

module.exports = mongoose.model('GoalHistory', goalHistorySchema);