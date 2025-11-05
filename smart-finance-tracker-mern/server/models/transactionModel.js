const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify transaction type']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    description: {
        type: String,
        trim: true,
        default: '',
        maxLength: [500, 'Description can not be more than 500 characters']
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true  // createdAt and updatedAt
    });

module.exports = mongoose.model('Transaction', transactionSchema);