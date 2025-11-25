const Goal = require('../models/goalModel');
const GoalHistory = require('../models/goalHistoryModel');

// Get all goals for user
exports.getGoals = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        let query = { userId };
        if (status) {
            query.status = status;
        }

        const goals = await Goal.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goals'
        });
    }
};

// Create new goal
exports.createGoal = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, targetAmount, currentAmount, startDate, deadline, template, notes } = req.body;

        if (!title || !targetAmount) {
            return res.status(400).json({
                success: false,
                message: 'Title and target amount are required'
            });
        }

        if (targetAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Target amount must be positive'
            });
        }

        if (currentAmount && currentAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Current amount cannot be negative'
            });
        }

        // Create goal
        const goal = await Goal.create({
            userId,
            title: title.trim(),
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount) || 0,
            startDate: startDate || Date.now(),
            deadline: deadline || null,
            template: template || null,
            notes: notes?.trim() || '',
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Goal created successfully',
            data: goal
        });
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating goal'
        });
    }
};

// Update goal
exports.updateGoal = async (req, res) => {
    try {
        const userId = req.user._id;
        const goalId = req.params.id;
        const { title, targetAmount, currentAmount, startDate, deadline, status, template, notes, notifiedComplete } = req.body;

        const goal = await Goal.findById(goalId);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        if (goal.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this goal'
            });
        }

        if (title !== undefined) goal.title = title.trim();
        if (targetAmount !== undefined) {
            if (targetAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Target amount must be positive'
                });
            }
            goal.targetAmount = Number(targetAmount);
        }
        if (currentAmount !== undefined) {
            if (currentAmount < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Current amount cannot be negative'
                });
            }
            goal.currentAmount = Number(currentAmount);
        }
        if (startDate !== undefined) goal.startDate = startDate;
        if (deadline !== undefined) goal.deadline = deadline;
        if (status !== undefined) goal.status = status;
        if (template !== undefined) goal.template = template;
        if (notes !== undefined) goal.notes = notes?.trim() || '';
        if (notifiedComplete !== undefined) goal.notifiedComplete = notifiedComplete;

        await goal.save();

        res.status(200).json({
            success: true,
            message: 'Goal updated successfully',
            data: goal
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating goal'
        });
    }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
    try {
        const userId = req.user._id;
        const goalId = req.params.id;

        const goal = await Goal.findById(goalId);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        if (goal.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this goal'
            });
        }

        await goal.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Goal deleted successfully'
        });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting goal'
        });
    }
};

// Get goal history for user
exports.getGoalHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { goalId } = req.query;

        let query = { userId };
        if (goalId) {
            query.goalId = goalId;
        }

        const history = await GoalHistory.find(query)
            .sort({ date: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goal history'
        });
    }
};

// Record goal event
exports.recordGoalEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { goalId, type, date, meta } = req.body;

        if (!goalId || !type) {
            return res.status(400).json({
                success: false,
                message: 'Goal ID and event type are required'
            });
        }

        const validTypes = ['created', 'contribution', 'completed', 'cancelled', 'deleted', 'milestone'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event type'
            });
        }

        const historyEntry = await GoalHistory.create({
            userId,
            goalId,
            type,
            date: date || Date.now(),
            meta: meta || {}
        });

        res.status(201).json({
            success: true,
            message: 'Event recorded successfully',
            data: historyEntry
        });
    } catch (error) {
        console.error('Record event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording event'
        });
    }
};