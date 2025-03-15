const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register route with logging
router.post('/register', (req, res, next) => {
  console.log('Register route hit with method:', req.method);
  console.log('Headers:', req.headers);
  next();
}, authController.register);

// Login route
router.post('/login', authController.login);

// Profile route - add auth middleware
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router; 