const Budget = require('../models/budgetModel');
const Transaction = require('../models/transactionModel');
const Category = require('../models/categoryModel');

// Helper: compute start/end dates for a YYYY-MM month
function monthRange(month) {
    const parts = month.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    return { start, end };
}

// GET /api/budgets?month=YYYY-MM
exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user._id;
        const month = req.query.month || new Date().toISOString().slice(0,7);
        const { start, end } = monthRange(month);

        const budgets = await Budget.find({ userId, month }).populate('categoryId', 'name');

        // aggregate spent per category
        const agg = await Transaction.aggregate([
            { $match: { userId: req.user._id, transactionDate: { $gte: start, $lte: end }, type: 'expense' } },
            { $group: { _id: '$category', spent: { $sum: '$amount' } } }
        ]);

        const spentMap = {};
        agg.forEach(a => { spentMap[a._id.toString()] = a.spent; });

        const data = budgets.map(b => {
            const cid = b.categoryId?._id?.toString() || null;
            const categoryName = b.categoryId? b.categoryId.name : 'Unknown';
            const spent = cid && spentMap[cid] ? spentMap[cid] : 0;
            const percent = b.amount > 0 ? Math.round((spent / b.amount) * 1000)/10 : 0;
            return {
                budgetId: b._id,
                categoryId: cid,
                category: categoryName,
                limit: b.amount,
                spent,
                remaining: Math.max(0, b.amount - spent),
                percent
            };
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error('Get budgets error', error);
        res.status(500).json({ success: false, message: 'Error fetching budgets' });
    }
};

// POST /api/budgets
exports.createBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { categoryId, amount, month, isTemplate, templateName } = req.body;

        if (!categoryId || amount == null) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        if (isTemplate && !templateName) return res.status(400).json({ success:false, message:'Template name required' });

        // ensure category exists and belongs to user or is default
        const cat = await Category.findOne({ _id: categoryId, $or: [{ isDefault: true, userId: null }, { userId }] });
        if (!cat) return res.status(400).json({ success:false, message:'Invalid category' });

        if (!isTemplate) {
            const existing = await Budget.findOne({ userId, categoryId, month });
            if (existing) return res.status(409).json({ success:false, message:'Budget already exists for this category/month' });
        }

        const b = await Budget.create({ userId, categoryId, amount, month: month || null, isTemplate: !!isTemplate, templateName: templateName || null });
        res.status(201).json({ success: true, data: b });
    } catch (error) {
        console.error('Create budget error', error);
        res.status(500).json({ success:false, message:'Error creating budget' });
    }
};

// TEMPLATES: list, apply, delete, update
// GET /api/budgets/templates
exports.getTemplates = async (req, res) => {
    try {
        const userId = req.user._id;
        const docs = await Budget.find({ userId, isTemplate: true }).populate('categoryId', 'name');
        const map = {};
        docs.forEach(d => {
            const name = d.templateName || 'Default';
            if (!map[name]) map[name] = [];
            map[name].push({ categoryId: d.categoryId?._id, category: d.categoryId? d.categoryId.name : 'Unknown', amount: d.amount });
        });
        const data = Object.keys(map).map(name => ({ name, items: map[name] }));
        res.json({ success:true, data });
    } catch (error) {
        console.error('Get templates error', error);
        res.status(500).json({ success:false, message:'Error fetching templates' });
    }
};

// POST /api/budgets/templates  { name, items: [{categoryId, amount}] }
exports.createTemplate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, items } = req.body;
        if (!name || !Array.isArray(items) || items.length===0) return res.status(400).json({ success:false, message:'Invalid payload' });
        const created = [];
        for (const it of items) {
            const cat = await Category.findOne({ _id: it.categoryId, $or: [{ isDefault: true, userId: null }, { userId }] });
            if (!cat) continue;
            const b = await Budget.create({ userId, categoryId: it.categoryId, amount: it.amount, isTemplate: true, templateName: name, month: null });
            created.push(b);
        }
        res.status(201).json({ success:true, data: created });
    } catch (error) {
        console.error('Create template error', error);
        res.status(500).json({ success:false, message:'Error creating template' });
    }
};

// POST /api/budgets/templates/:name/apply  { month: 'YYYY-MM' }
exports.applyTemplate = async (req, res) => {
    try {
        const userId = req.user._id;
        const name = req.params.name;
        const { month } = req.body;
        if (!month) return res.status(400).json({ success:false, message:'month required' });
        const templates = await Budget.find({ userId, isTemplate: true, templateName: name });
        if (!templates || templates.length===0) return res.status(404).json({ success:false, message:'Template not found' });
        const created = [];
        for (const t of templates) {
            // skip if budget exists for category/month
            const exists = await Budget.findOne({ userId, categoryId: t.categoryId, month, isTemplate: false });
            if (exists) continue;
            const b = await Budget.create({ userId, categoryId: t.categoryId, amount: t.amount, month, isTemplate: false });
            created.push(b);
        }
        res.json({ success:true, data: created });
    } catch (error) {
        console.error('Apply template error', error);
        res.status(500).json({ success:false, message:'Error applying template' });
    }
};

// DELETE /api/budgets/templates/:name
exports.deleteTemplate = async (req, res) => {
    try {
        const userId = req.user._id;
        const name = req.params.name;
        await Budget.deleteMany({ userId, isTemplate: true, templateName: name });
        res.json({ success:true });
    } catch (error) {
        console.error('Delete template error', error);
        res.status(500).json({ success:false, message:'Error deleting template' });
    }
};

// PUT /api/budgets/:id
exports.updateBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const { amount, month } = req.body;

        const b = await Budget.findById(id);
        if (!b) return res.status(404).json({ success:false, message:'Not found' });
        if (b.userId.toString() !== userId.toString()) return res.status(403).json({ success:false, message:'Not authorized' });

        if (amount != null) b.amount = amount;
        if (month) b.month = month;
        await b.save();
        res.json({ success:true, data: b });
    } catch (error) {
        console.error('Update budget error', error);
        res.status(500).json({ success:false, message:'Error updating budget' });
    }
};

// DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const b = await Budget.findById(id);
        if (!b) return res.status(404).json({ success:false, message:'Not found' });
        if (b.userId.toString() !== userId.toString()) return res.status(403).json({ success:false, message:'Not authorized' });
        await b.deleteOne();
        res.json({ success:true });
    } catch (error) {
        console.error('Delete budget error', error);
        res.status(500).json({ success:false, message:'Error deleting budget' });
    }
};

// GET /api/budgets/recommendations
// Simple recommendations based on average spending per category
exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        // aggregate last 3 months avg spending per category
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth()-3, 1);

        const agg = await Transaction.aggregate([
            { $match: { userId: req.user._id, transactionDate: { $gte: start }, type: 'expense' } },
            { $group: { _id: '$category', avgSpent: { $avg: '$amount' } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
            { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
            { $project: { categoryId: '$_id', category: '$cat.name', recommended: { $round: ['$avgSpent', 2] } } }
        ]);

        res.json({ success:true, data: agg });
    } catch (error) {
        console.error('Recommendations error', error);
        res.status(500).json({ success:false, message:'Error computing recommendations' });
    }
};
