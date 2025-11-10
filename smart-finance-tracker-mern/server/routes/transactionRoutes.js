const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummaryStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummaryStats);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction);

module.exports = router;