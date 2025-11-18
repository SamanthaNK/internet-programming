const express = require('express');
const router = express.Router();
const {
    getMonthlyReport,
    getCategoryBreakdown,
    getSpendingTrends,
    getComparisonReport,
    getTopCategories,
    getSpendingByDayOfWeek
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/monthly', getMonthlyReport);
router.get('/category', getCategoryBreakdown);
router.get('/trends', getSpendingTrends);
router.get('/comparison', getComparisonReport);
router.get('/top-categories', getTopCategories);
router.get('/day-of-week', getSpendingByDayOfWeek);

module.exports = router;