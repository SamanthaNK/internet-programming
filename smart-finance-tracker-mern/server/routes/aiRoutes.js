const express = require('express');
const router = express.Router();
const {
    getDashboardTip,
    getBudgetSuggestions,
    getSpendingInsights,
    getSpendingAlerts
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard-tip', getDashboardTip);
router.get('/budget-suggestions', getBudgetSuggestions);
router.get('/spending-insights', getSpendingInsights);
router.get('/spending-alerts', getSpendingAlerts);

module.exports = router;