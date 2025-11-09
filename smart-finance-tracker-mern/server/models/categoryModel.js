const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true,
        maxLength: [50, 'Category name cannot exceed 50 characters']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true  // createdAt and updatedAt
    });

// Index to ensure unique category names per user and type
categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);