const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getRecommendations
} = require('../controllers/budgetController');

const { getTemplates, createTemplate, applyTemplate, deleteTemplate } = require('../controllers/budgetController');

router.use(protect);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.get('/recommendations', getRecommendations);
// templates
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.post('/templates/:name/apply', applyTemplate);
router.delete('/templates/:name', deleteTemplate);

module.exports = router;
