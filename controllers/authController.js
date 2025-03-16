 
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const User = require('../models/userModel');
const { sendResetEmail } = require('../services/emailService');
const { body, validationResult } = require('express-validator');

exports.login = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.json({ user });
  },
];

exports.register = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim(),
  body('name').notEmpty().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ email, password, name });
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(201).json({ user: newUser });
  },
];

exports.resetPassword = [
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`;
    const emailResult = await sendResetEmail(email, resetLink);
    if (emailResult.success) {
      res.json({ message: emailResult.message });
    } else {
      res.status(500).json({ message: emailResult.message });
    }
  },
];

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};