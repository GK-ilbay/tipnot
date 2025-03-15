const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Add content to favorites
router.post('/user/favorites', authMiddleware, userController.addFavorite);

// Remove content from favorites
router.delete('/user/favorites/:id', authMiddleware, userController.removeFavorite);

// Get user's favorite content list
router.get('/user/favorites', authMiddleware, userController.getFavorites);

// Save reading progress
router.post('/user/progress', authMiddleware, userController.saveProgress);

// Get reading progress for specific content
router.get('/user/progress/:id', authMiddleware, userController.getProgress);

module.exports = router; 