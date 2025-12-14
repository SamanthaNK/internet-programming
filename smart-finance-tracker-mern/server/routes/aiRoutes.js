const express = require('express');
const router = express.Router();
const {
    getDashboardTip,
    getBudgetSuggestions,
    getSpendingInsights,
    getSpendingAlerts
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// Protect AI endpoints and apply rate limiting per authenticated user/IP
router.use(protect);
router.use(aiLimiter);

router.get('/dashboard-tip', getDashboardTip);
router.get('/budget-suggestions', getBudgetSuggestions);
router.get('/spending-insights', getSpendingInsights);
router.get('/spending-alerts', getSpendingAlerts);

module.exports = router;