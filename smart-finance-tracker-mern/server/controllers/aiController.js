const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function to call Gemini API
const callGeminiAPI = async (prompt) => {
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text;

        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Gemini API request failed");
    }
};

const Transaction = require('../models/transactionModel');
const Budget = require('../models/budgetModel');
const Category = require('../models/categoryModel');
const Goal = require('../models/goalModel');

const cache = require('../utils/cache');

// Get financial tip for dashboard
exports.getDashboardTip = async (req, res) => {
    try {
        const userId = req.user._id;

        // Check cache first
        const cacheKey = `${userId}:dashboardTip`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached });
        }

        // Get last 7 days of transactions
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentTransactions = await Transaction.find({
            userId,
            transactionDate: { $gte: sevenDaysAgo }
        }).populate('category', 'name');

        const totalSpent = recentTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = recentTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const avgDailySpending = totalSpent / 7;

        // Count transactions by category
        const categorySpending = {};
        recentTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const catName = t.category?.name || 'Other';
                categorySpending[catName] = (categorySpending[catName] || 0) + t.amount;
            });

        const topCategory = Object.entries(categorySpending)
            .sort((a, b) => b[1] - a[1])[0];

        // Get active goals progress
        const activeGoals = await Goal.find({ userId, status: 'active' });
        const goalsProgress = activeGoals.map(g => {
            const percent = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
            return { title: g.title, percent };
        });

        const prompt = `You are a friendly financial advisor. Based on this user's last 7 days:
- Total spent: ${totalSpent.toFixed(2)} XAF
- Total income: ${totalIncome.toFixed(2)} XAF
- Average daily spending: ${avgDailySpending.toFixed(2)} XAF
- Top spending category: ${topCategory ? topCategory[0] : 'None'} (${topCategory ? topCategory[1].toFixed(2) : 0} XAF)
- Active goals: ${goalsProgress.length > 0 ? goalsProgress.map(g => `${g.title} (${g.percent}%)`).join(', ') : 'None'}

Provide ONE brief, encouraging financial tip (maximum 25 words). Be specific and actionable based on their data.`;

        const aiResponse = await callGeminiAPI(prompt);

        const responsePayload = {
            tip: aiResponse || "Track your daily expenses to identify patterns and save more effectively.",
            stats: {
                weeklySpending: totalSpent,
                dailyAverage: avgDailySpending,
                topCategory: topCategory ? topCategory[0] : null,
                goalsProgress: goalsProgress.slice(0, 3)
            }
        };

        // Cache for 10 minutes
        cache.set(cacheKey, responsePayload, 10 * 60 * 1000);

        res.json({ success: true, data: responsePayload });

    } catch (error) {
        console.error('Dashboard Tip Error:', error);
        res.json({
            success: true,
            data: {
                tip: "Review your spending regularly to stay on track with your financial goals.",
                stats: null
            }
        });
    }
};

// Get recommendations for budget planning
exports.getBudgetSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentMonth = new Date().toISOString().slice(0, 7);

        // Get current month's spending by category
        const [year, month] = currentMonth.split('-');
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const transactions = await Transaction.find({
            userId,
            type: 'expense',
            transactionDate: { $gte: startDate, $lte: endDate }
        }).populate('category', 'name');

        // Calculate spending by category
        const categorySpending = {};
        transactions.forEach(t => {
            const catName = t.category?.name || 'Other';
            categorySpending[catName] = (categorySpending[catName] || 0) + t.amount;
        });

        // Get existing budgets
        const budgets = await Budget.find({ userId, month: currentMonth }).populate('categoryId', 'name');

        // Calculate budget vs actual for categories with budgets
        const budgetPerformance = budgets.map(b => {
            const catName = b.categoryId?.name;
            const spent = categorySpending[catName] || 0;
            const percent = b.amount > 0 ? (spent / b.amount * 100) : 0;
            return {
                category: catName,
                budget: b.amount,
                spent,
                percent: percent.toFixed(1),
                status: percent > 100 ? 'over' : percent >= 80 ? 'warning' : 'good'
            };
        });

        // Find categories without budgets
        const categoriesWithoutBudgets = Object.keys(categorySpending).filter(cat =>
            !budgets.some(b => b.categoryId?.name === cat)
        );

        const prompt = `You are a financial advisor. Analyze this budget data and provide suggestions.

Current Budget Performance:
${budgetPerformance.map(b => `- ${b.category}: ${b.spent.toFixed(2)} / ${b.budget.toFixed(2)} XAF (${b.percent}%) - ${b.status}`).join('\n')}

Categories without budgets (with current spending):
${categoriesWithoutBudgets.map(cat => `- ${cat}: ${categorySpending[cat].toFixed(2)} XAF`).join('\n')}

Provide 3-4 specific, actionable budget recommendations. Format as a JSON array of strings.
Example: ["Reduce dining out budget by 15%", "Set a 50000 XAF budget for entertainment"]

Return ONLY the JSON array, no other text or markdown.`;

        const aiResponse = await callGeminiAPI(prompt);

        let suggestions = [];
        if (aiResponse) {
            try {
                // Clean response - remove markdown code blocks
                let cleaned = aiResponse.trim();
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                suggestions = JSON.parse(cleaned);

                // Ensure it's an array
                if (!Array.isArray(suggestions)) {
                    throw new Error('Response is not an array');
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Response:', aiResponse);
                suggestions = [
                    "Review categories exceeding 80% of budget",
                    "Set budgets for categories with regular spending",
                    "Consider reducing spending in your top expense category"
                ];
            }
        }

        const responsePayload = {
            suggestions,
            performance: budgetPerformance,
            unbudgetedCategories: categoriesWithoutBudgets.map(cat => ({
                category: cat,
                currentSpending: categorySpending[cat]
            }))
        };

        // Cache budget suggestions for 10 minutes
        cache.set(`${userId}:budgetSuggestions`, responsePayload, 10 * 60 * 1000);

        res.json({ success: true, data: responsePayload });

    } catch (error) {
        console.error('Budget Suggestions Error:', error);
        res.json({
            success: true,
            data: {
                suggestions: [
                    "Track your spending for a month before setting budgets",
                    "Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings"
                ],
                performance: [],
                unbudgetedCategories: []
            }
        });
    }
};

// Get analysis for reports page
exports.getSpendingInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = 'month' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;
        if (period === 'week') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            startDate = new Date(now.getFullYear(), 0, 1); // year
        }

        const transactions = await Transaction.find({
            userId,
            transactionDate: { $gte: startDate }
        }).populate('category', 'name type');

        // Calculate metrics
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

        // Category breakdown
        const categoryTotals = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const catName = t.category?.name || 'Other';
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
        });

        const topCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Calculate previous period for comparison
        const previousStartDate = new Date(startDate);
        if (period === 'week') {
            previousStartDate.setDate(previousStartDate.getDate() - 7);
        } else if (period === 'month') {
            previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        } else {
            previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        }

        const previousTransactions = await Transaction.find({
            userId,
            transactionDate: { $gte: previousStartDate, $lt: startDate }
        });

        const previousExpense = previousTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseChange = previousExpense > 0
            ? ((totalExpense - previousExpense) / previousExpense * 100)
            : 0;

        // Get goals data for context
        const activeGoals = await Goal.find({ userId, status: 'active' });
        const goalsContext = activeGoals.length > 0
            ? activeGoals.map(g => {
                const remaining = g.targetAmount - g.currentAmount;
                const daysToDeadline = g.deadline ? Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                return `${g.title}: ${remaining.toFixed(0)} XAF remaining${daysToDeadline ? `, ${daysToDeadline} days left` : ''}`;
            }).join('; ')
            : 'No active goals';

        const prompt = `You are a financial analyst. Analyze this spending data:

Period: ${period}
- Total Income: ${totalIncome.toFixed(2)} XAF
- Total Expenses: ${totalExpense.toFixed(2)} XAF
- Savings Rate: ${savingsRate.toFixed(1)}%
- Expense Change vs Previous Period: ${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}%

Top Spending Categories:
${topCategories.map(([cat, amount], i) => `${i + 1}. ${cat}: ${amount.toFixed(2)} XAF`).join('\n')}

Active Savings Goals: ${goalsContext}

Provide 3-4 key insights about spending patterns and trends. Be specific and data-driven. Consider their goals in your advice.
Format as JSON array of strings. Return ONLY the JSON array, no markdown.`;

        const aiResponse = await callGeminiAPI(prompt);

        let insights = [];
        if (aiResponse) {
            try {
                let cleaned = aiResponse.trim();
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                insights = JSON.parse(cleaned);

                if (!Array.isArray(insights)) {
                    throw new Error('Not an array');
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Response:', aiResponse);
                insights = [
                    `Your spending ${expenseChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseChange).toFixed(1)}% compared to the previous period`,
                    `${topCategories[0]?.[0] || 'Your top category'} represents your largest expense area`,
                    `Your current savings rate is ${savingsRate.toFixed(1)}%`
                ];
            }
        }

        const responsePayload = {
            insights,
            metrics: {
                totalIncome,
                totalExpense,
                savingsRate: savingsRate.toFixed(1),
                expenseChange: expenseChange.toFixed(1),
                topCategories: topCategories.map(([cat, amount]) => ({ category: cat, amount }))
            }
        };

        // Cache spending insights for 10 minutes
        cache.set(`${userId}:spendingInsights:${period}`, responsePayload, 10 * 60 * 1000);

        res.json({ success: true, data: responsePayload });

    } catch (error) {
        console.error('Spending Insights Error:', error);
        res.json({
            success: true,
            data: {
                insights: [
                    "Continue tracking your expenses to identify patterns",
                    "Review your spending categories regularly"
                ],
                metrics: null
            }
        });
    }
};

// Detect unusual spending patterns and budget alerts
exports.getSpendingAlerts = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get last 30 days of transactions
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactions = await Transaction.find({
            userId,
            type: 'expense',
            transactionDate: { $gte: thirtyDaysAgo }
        }).populate('category', 'name');

        // Calculate average spending per category
        const categoryStats = {};
        transactions.forEach(t => {
            const catName = t.category?.name || 'Other';
            if (!categoryStats[catName]) {
                categoryStats[catName] = { amounts: [], total: 0 };
            }
            categoryStats[catName].amounts.push(t.amount);
            categoryStats[catName].total += t.amount;
        });

        // Find categories with unusual spending
        const alerts = [];
        Object.entries(categoryStats).forEach(([category, stats]) => {
            if (stats.amounts.length < 2) return;

            const average = stats.total / stats.amounts.length;
            const maxAmount = Math.max(...stats.amounts);

            // Alert if any transaction is 2x average
            if (maxAmount > average * 2) {
                alerts.push({
                    type: 'unusual_high',
                    category,
                    message: `Unusually high ${category} spending: ${maxAmount.toFixed(0)} XAF (avg: ${average.toFixed(0)} XAF)`
                });
            }
        });

        // Get current month budget status
        const currentMonth = new Date().toISOString().slice(0, 7);
        const budgets = await Budget.find({ userId, month: currentMonth }).populate('categoryId', 'name');

        const [year, month] = currentMonth.split('-');
        const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthEnd = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const monthTransactions = await Transaction.find({
            userId,
            type: 'expense',
            transactionDate: { $gte: monthStart, $lte: monthEnd }
        });

        const categorySpending = {};
        monthTransactions.forEach(t => {
            const catId = t.category?.toString();
            categorySpending[catId] = (categorySpending[catId] || 0) + t.amount;
        });

        budgets.forEach(b => {
            const catId = b.categoryId?._id?.toString();
            const spent = categorySpending[catId] || 0;
            const percent = b.amount > 0 ? (spent / b.amount * 100) : 0;

            if (percent >= 80 && percent < 100) {
                alerts.push({
                    type: 'budget_warning',
                    category: b.categoryId?.name,
                    message: `${b.categoryId?.name} budget is ${percent.toFixed(0)}% used (${spent.toFixed(0)} / ${b.amount.toFixed(0)} XAF)`
                });
            } else if (percent >= 100) {
                alerts.push({
                    type: 'budget_exceeded',
                    category: b.categoryId?.name,
                    message: `${b.categoryId?.name} budget exceeded! ${spent.toFixed(0)} / ${b.amount.toFixed(0)} XAF`
                });
            }
        });

        // Check goals at risk
        const activeGoals = await Goal.find({ userId, status: 'active', deadline: { $exists: true, $ne: null } });

        activeGoals.forEach(g => {
            const remaining = g.targetAmount - g.currentAmount;
            const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            if (daysLeft > 0 && daysLeft <= 30 && remaining > 0) {
                const dailyNeeded = remaining / daysLeft;
                alerts.push({
                    type: 'goal_at_risk',
                    category: g.title,
                    message: `Goal "${g.title}" needs ${dailyNeeded.toFixed(0)} XAF/day for ${daysLeft} days to reach target`
                });
            }
        });

        res.json({
            success: true,
            data: { alerts }
        });

    } catch (error) {
        console.error('Spending Alerts Error:', error);
        res.json({
            success: true,
            data: { alerts: [] }
        });
    }
};