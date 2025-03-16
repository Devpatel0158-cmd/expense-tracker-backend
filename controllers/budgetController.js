const Budget = require('../models/budgetModel');
const { body, param, validationResult } = require('express-validator');

exports.getBudgets = [
    async (req, res) => {
      const budgets = Budget.findByUserId(req.user.id);
      
      const alerts = Budget.checkAlerts(req.user.id);
      if (alerts.length > 0) {
        res.set('X-Budget-Alerts', JSON.stringify(alerts)); // Custom header for alerts
      }
      res.json(budgets);
    },
  ];

  exports.createBudget = [
    body('category').notEmpty().trim(),
    body('amount').isFloat({ min: 0 }).toFloat(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { category, amount } = req.body;
      const newBudget = { userId: req.user.id, category, amount };
      const createdBudget = Budget.create(newBudget);
      res.status(201).json(createdBudget);
    },
  ];

  exports.updateBudget = [
    param('id').isInt(),
    body('category').optional().notEmpty().trim(),
    body('amount').optional().isFloat({ min: 0 }).toFloat(),
    body('remaining').optional().isFloat().toFloat(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const id = parseInt(req.params.id);
      const budget = Budget.update(id, req.body);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      res.json(budget);
    },
  ];

  exports.deleteBudget = [
    param('id').isInt(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const id = parseInt(req.params.id);
      Budget.delete(id);
      res.status(204).send();
    },
  ];


  