const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    deleteTransaction,
    getSummaryStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);
router.get('/summary', getSummaryStats);

module.exports = router;