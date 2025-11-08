const Transaction = require('../models/transactionModel');

// Get all transactions for user
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ date: -1 }); // newest first

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

        const transaction = new Transaction({
            userId: req.userId,
            type,
            amount,
            category,
            description,
            transactionDate: date || Date.now()
        });

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction'
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
        if (transaction.userId.toString() !== req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this transaction'
            });
        }

        await transaction.deleteOne();

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
        const transactions = await Transaction.find({ userId: req.userId });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
            }
        });

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
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