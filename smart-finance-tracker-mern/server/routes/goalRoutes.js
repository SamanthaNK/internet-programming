const express = require('express');
const router = express.Router();
const {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalHistory,
    recordGoalEvent
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

router.get('/history', getGoalHistory);
router.post('/history', recordGoalEvent);

module.exports = router;