const Category = require('../models/categoryModel');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const { type } = req.query;

        let query = {
            $or: [
                { isDefault: true, userId: null },
                { userId: req.user._id }
            ]
        };

        // Filter by type if provided
        if (type && ['income', 'expense'].includes(type)) {
            query.type = type;
        }

        // Sort categories by name
        const categories = await Category.find(query).sort({ name: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting categories'
        });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({
            name,
            type,
            $or: [
                { isDefault: true },
                { userId: req.user._id },
            ]
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Create new category
        const category = await Category.create({
            name,
            type,
            isDefault: false,
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category'
        });
    }
};