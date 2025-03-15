const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Submit feedback
router.post('/feedback', feedbackController.submitFeedback);

// View all feedback (Admin-only)
router.get('/feedback', authMiddleware, feedbackController.getAllFeedback);

module.exports = router; 