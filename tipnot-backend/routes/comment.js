const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a comment - need authentication
router.post('/comments', authMiddleware, commentController.addComment);

// Fetch comments for content - no authentication needed
router.get('/comments/:contentId', commentController.getComments);

// Delete own comment - need authentication
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

// For the direct content comment routes
router.post('/content/:contentId/comments', authMiddleware, commentController.addComment);
router.get('/content/:contentId/comments', commentController.getComments);

module.exports = router; 