const Transaction = require('../models/transactionModel');
const Category = require('../models/categoryModel')
const cache = require('../utils/cache');

// Get all transactions for user
exports.getTransactions = async (req, res) => {
    try {
        // Filter transactions based on query parameters
        const {
            type,
            category,
            startDate,
            endDate,
            sort,
            limit = 100
        } = req.query

        let query = { userId: req.user._id };

        if (type && ['income', 'expense'].includes(type)) {
            query.type = type;
        }

        if (category) {
            query.category = category;
        }

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) {
                query.transactionDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.transactionDate.$lte = new Date(endDate);
            }
        }

        // Decide how to sort transactions
        let sortOption = { transactionDate: -1 }; // default newest first

        if (sort === 'date-asc') sortOption = { transactionDate: 1 };
        if (sort === 'date-desc') sortOption = { transactionDate: -1 };
        if (sort === 'amount-asc') sortOption = { amount: 1 };
        if (sort === 'amount-desc') sortOption = { amount: -1 };

        const transactions = await Transaction.find(query)
            .populate('category', 'name type')
            .sort(sortOption)
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions'
        });
    }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        // Check if category exists and belongs to the user
        const categoryExists = await Category.findOne({
            _id: category,
            $or: [
                { isDefault: true, userId: null },
                { userId: req.user._id }
            ]
        });

        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            amount,
            category,
            description,
            transactionDate: date || Date.now()
        });

        const populatedTransaction = await Transaction
            .findById(transaction._id)
            .populate('category', 'name type');

        // Clear user AI cache when a new transaction is created
        try { cache.clearUser(req.user._id.toString()); } catch (e) { console.error('Cache clear error:', e); }

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: populatedTransaction
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction'
        });
    }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        // Find transaction
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Check if user owns the transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this transaction'
            });
        }

        // If category is being updated, validate it
        if (category) {
            const categoryExists = await Category.findOne({
                _id: category,
                $or: [
                    { isDefault: true, userId: null },
                    { userId: req.user._id }
                ]
            });

            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category'
                });
            }
        }

        // Update fields
        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.description = description !== undefined ? description : transaction.description;
        transaction.transactionDate = date || transaction.transactionDate;

        await transaction.save();

        // Clear user AI cache when a transaction is updated
        try { cache.clearUser(req.user._id.toString()); } catch (e) { console.error('Cache clear error:', e); }

        const populatedTransaction = await Transaction
            .findById(transaction._id)
            .populate('category', 'name type');

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: populatedTransaction
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating transaction'
        });
    }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        // Check if transaction exists
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Check if user owns the transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this transaction'
            });
        }

        await transaction.deleteOne();

        // Clear user AI cache when a transaction is deleted
        try { cache.clearUser(req.user._id.toString()); } catch (e) { console.error('Cache clear error:', e); }

        res.json({
            success: true,
            message: 'Transaction deleted'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction'
        });
    }
};

// Get dashboard summary statistics
exports.getSummaryStats = async (req, res) => {
    try {

        // Get period from URL query parameters
        const { period = 'month' } = req.query;

        let startDate;
        const now = new Date();

        // Calculate start date based on period
        if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        } else {
            startDate = new Date(0); // From beginning
        }

        const transactions = await Transaction.find({
            userId: req.user._id,
            transactionDate: { $gte: startDate }
        });

        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
                incomeCount++;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
                expenseCount++;
            }
        });

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                incomeCount,
                expenseCount,
                totalTransactions: transactions.length
            }
        });
    } catch (error) {
        console.error('Get stats summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
};