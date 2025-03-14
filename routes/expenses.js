const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', verifyToken, expenseController.getExpenses);
router.post('/', verifyToken, upload.single('receipt'), expenseController.createExpense);
router.put('/:id', verifyToken, upload.single('receipt'), expenseController.updateExpense);
router.delete('/:id', verifyToken, expenseController.deleteExpense);

module.exports = router;