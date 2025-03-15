const User = require('../models/user');

// Middleware to verify if user is an admin
module.exports = async (req, res, next) => {
  try {
    // First check if the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if the user is an admin
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized: Admin access required' });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 