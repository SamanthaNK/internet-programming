const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
require('dotenv').config();


const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', isDefault: true },
    { name: 'Freelance', type: 'income', isDefault: true },
    { name: 'Business', type: 'income', isDefault: true },
    { name: 'Investment', type: 'income', isDefault: true },
    { name: 'Gift', type: 'income', isDefault: true },
    { name: 'Other Income', type: 'income', isDefault: true },

    // Expense categories
    { name: 'Food & Dining', type: 'expense', isDefault: true },
    { name: 'Transportation', type: 'expense', isDefault: true },
    { name: 'Shopping', type: 'expense', isDefault: true },
    { name: 'Entertainment', type: 'expense', isDefault: true },
    { name: 'Bills & Utilities', type: 'expense', isDefault: true },
    { name: 'Healthcare', type: 'expense', isDefault: true },
    { name: 'Education', type: 'expense', isDefault: true },
    { name: 'Rent', type: 'expense', isDefault: true },
    { name: 'Other Expense', type: 'expense', isDefault: true }
];

async function createDefaultCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Check if default categories already exist
        const existingDefaults = await Category.countDocuments({ isDefault: true });

        if (existingDefaults > 0) {
            console.log('Default categories already exist');
            process.exit(0);
        }

        // Create default categories
        await Category.insertMany(defaultCategories);
        console.log('Default categories created successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error creating default categories', error);
        process.exit(1);
    }
}

createDefaultCategories();