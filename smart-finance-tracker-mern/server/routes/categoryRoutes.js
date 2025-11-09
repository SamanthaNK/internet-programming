const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth')

router.use(protect);

router.get('/', getCategories);
router.post('/', createCategory);

module.exports = router;