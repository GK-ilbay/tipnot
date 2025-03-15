const express = require('express');
const router = express.Router();

// Controller
const homeController = require('../controllers/homeController');

// Define routes
router.get('/', homeController.index);

module.exports = router; 