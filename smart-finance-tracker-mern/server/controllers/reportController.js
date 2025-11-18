const Transaction = require('../models/transactionModel');
const Category = require('../models/categoryModel');

// Function to get date range
const getDateRange = (period) => {
    const now = new Date();
    let startDate;

    switch (period) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        case 'last-month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
        case 'last-year':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            break;
        default:
            startDate = new Date(0); // All time
    }

    return { startDate, endDate: new Date() };
};

// GET MONTHLY REPORT: Income vs Expense by month
exports.getMonthlyReport = async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        // Get transactions for the year
        const transactions = await Transaction.find({
            userId: req.user._id,
            transactionDate: {
                $gte: new Date(targetYear, 0, 1),
                $lte: new Date(targetYear, 11, 31, 23, 59, 59)
            }
        }).populate('category');

        // Initialize monthly data
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(targetYear, i).toLocaleString('default', { month: 'short' }),
            income: 0,
            expense: 0,
            net: 0
        }));

        // Combine data by month
        transactions.forEach(transaction => {
            const month = new Date(transaction.transactionDate).getMonth();
            if (transaction.type === 'income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expense += transaction.amount;
            }
            monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
        });

        res.status(200).json({
            success: true,
            data: {
                year: targetYear,
                months: monthlyData,
                summary: {
                    totalIncome: monthlyData.reduce((sum, m) => sum + m.income, 0),
                    totalExpense: monthlyData.reduce((sum, m) => sum + m.expense, 0),
                    totalNet: monthlyData.reduce((sum, m) => sum + m.net, 0)
                }
            }
        });

    } catch (error) {
        console.error('Monthly report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating monthly report'
        });
    }
};

// GET CATEGORY BREAKDOWN: Spending by category
exports.getCategoryBreakdown = async (req, res) => {
    try {
        const { period = 'month', type = 'expense' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        // Combine transactions by category
        const breakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    type: type,
                    transactionDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Populate category details
        await Category.populate(breakdown, { path: '_id' });

        // Format response
        const categories = breakdown.map(item => ({
            category: item._id?.name || 'Uncategorized',
            categoryId: item._id?._id,
            amount: item.total,
            count: item.count,
            percentage: 0 // Will calculate after getting total
        }));

        // Calculate total and percentages
        const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
        categories.forEach(cat => {
            cat.percentage = total > 0 ? ((cat.amount / total) * 100).toFixed(2) : 0;
        });

        res.status(200).json({
            success: true,
            data: {
                period,
                type,
                categories,
                total,
                transactionCount: categories.reduce((sum, cat) => sum + cat.count, 0)
            }
        });

    } catch (error) {
        console.error('Category breakdown error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating category breakdown'
        });
    }
};

// GET SPENDING TRENDS: Daily/Weekly spending over time
exports.getSpendingTrends = async (req, res) => {
    try {
        const { period = 'month', groupBy = 'day' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        // Get all transactions in period
        const transactions = await Transaction.find({
            userId: req.user._id,
            transactionDate: { $gte: startDate, $lte: endDate }
        }).sort({ transactionDate: 1 });

        // Group transactions by day or week
        const trends = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.transactionDate);
            let key;

            if (groupBy === 'week') {
                // Get week number
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else {
                // Daily grouping
                key = date.toISOString().split('T')[0];
            }

            if (!trends[key]) {
                trends[key] = { date: key, income: 0, expense: 0, net: 0 };
            }

            if (transaction.type === 'income') {
                trends[key].income += transaction.amount;
            } else {
                trends[key].expense += transaction.amount;
            }
            trends[key].net = trends[key].income - trends[key].expense;
        });

        // Convert to array and sort
        const trendData = Object.values(trends).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        res.status(200).json({
            success: true,
            data: {
                period,
                groupBy,
                trends: trendData,
                summary: {
                    totalIncome: trendData.reduce((sum, t) => sum + t.income, 0),
                    totalExpense: trendData.reduce((sum, t) => sum + t.expense, 0),
                    averageDaily: trendData.length > 0
                        ? trendData.reduce((sum, t) => sum + t.expense, 0) / trendData.length
                        : 0
                }
            }
        });

    } catch (error) {
        console.error('Spending trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating spending trends'
        });
    }
};

// GET COMPARISON REPORT: Compare periods
exports.getComparisonReport = async (req, res) => {
    try {
        const now = new Date();

        // Current month
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Last month
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Get current month transactions
        const currentTransactions = await Transaction.find({
            userId: req.user._id,
            transactionDate: { $gte: currentMonthStart, $lte: currentMonthEnd }
        });

        // Get last month transactions
        const lastTransactions = await Transaction.find({
            userId: req.user._id,
            transactionDate: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        // Calculate totals
        const currentIncome = currentTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const currentExpense = currentTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const lastIncome = lastTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const lastExpense = lastTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate changes
        const incomeChange = lastIncome > 0
            ? ((currentIncome - lastIncome) / lastIncome * 100).toFixed(2)
            : 0;
        const expenseChange = lastExpense > 0
            ? ((currentExpense - lastExpense) / lastExpense * 100).toFixed(2)
            : 0;

        // Calculate savings rate
        const currentSavingsRate = currentIncome > 0
            ? ((currentIncome - currentExpense) / currentIncome * 100).toFixed(2)
            : 0;
        const lastSavingsRate = lastIncome > 0
            ? ((lastIncome - lastExpense) / lastIncome * 100).toFixed(2)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                current: {
                    period: 'This Month',
                    income: currentIncome,
                    expense: currentExpense,
                    net: currentIncome - currentExpense,
                    savingsRate: currentSavingsRate,
                    transactionCount: currentTransactions.length
                },
                previous: {
                    period: 'Last Month',
                    income: lastIncome,
                    expense: lastExpense,
                    net: lastIncome - lastExpense,
                    savingsRate: lastSavingsRate,
                    transactionCount: lastTransactions.length
                },
                changes: {
                    income: parseFloat(incomeChange),
                    expense: parseFloat(expenseChange),
                    savingsRate: (currentSavingsRate - lastSavingsRate).toFixed(2)
                }
            }
        });

    } catch (error) {
        console.error('Comparison report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating comparison report'
        });
    }
};

// GET TOP CATEGORIES: Highest spending categories
exports.getTopCategories = async (req, res) => {
    try {
        const { period = 'month', limit = 5 } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const topCategories = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    type: 'expense',
                    transactionDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgTransaction: { $avg: '$amount' }
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        await Category.populate(topCategories, { path: '_id' });

        const categories = topCategories.map(item => ({
            category: item._id?.name || 'Uncategorized',
            total: item.total,
            count: item.count,
            average: item.avgTransaction
        }));

        res.status(200).json({
            success: true,
            data: {
                period,
                categories
            }
        });

    } catch (error) {
        console.error('Top categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching top categories'
        });
    }
};

// GET SPENDING BY DAY OF WEEK
exports.getSpendingByDayOfWeek = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const transactions = await Transaction.find({
            userId: req.user._id,
            type: 'expense',
            transactionDate: { $gte: startDate, $lte: endDate }
        });

        // Initialize days of week
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayData = daysOfWeek.map(day => ({ day, amount: 0, count: 0 }));

        // Combine by day of week
        transactions.forEach(transaction => {
            const dayIndex = new Date(transaction.transactionDate).getDay();
            dayData[dayIndex].amount += transaction.amount;
            dayData[dayIndex].count += 1;
        });

        // Calculate averages
        dayData.forEach(day => {
            day.average = day.count > 0 ? day.amount / day.count : 0;
        });

        res.status(200).json({
            success: true,
            data: {
                period,
                days: dayData
            }
        });

    } catch (error) {
        console.error('Day of week error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing spending by day'
        });
    }
};