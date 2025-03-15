const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a comment
router.post('/content/:contentId/comments', authMiddleware, commentController.addComment);

// Fetch comments for content
router.get('/content/:contentId/comments', commentController.getComments);

// Delete own comment
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

module.exports = router; 