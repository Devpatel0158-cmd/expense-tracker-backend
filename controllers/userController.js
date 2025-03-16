const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');

exports.getUser = [
    async (req, res) => {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    },
  ];

  exports.updateUser = [
    body('name').optional().notEmpty().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }).trim(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const updates = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profilePic: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : undefined,
      };
      const user = User.update(req.user.id, updates);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    },
  ];