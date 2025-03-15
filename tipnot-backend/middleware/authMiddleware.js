const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  console.log('Auth middleware running');
  
  // Get token from header
  // Try Authorization header first (Bearer token)
  let token = req.header('Authorization');
  
  // If token comes as Bearer token, extract the actual token
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  
  // If no token in Authorization header, try x-auth-token
  if (!token) {
    token = req.header('x-auth-token');
  }
  
  // Check if we have cookies and a token there
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  // If still no token, check if this is a development environment
  // and allow anonymous access for testing
  if (!token) {
    console.log('No authentication token found');
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: proceeding without authentication');
      req.user = { 
        isAnonymous: true,
        name: 'Guest User',
        role: 'user'
      };
      return next();
    }
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded JWT token:', decoded);
    
    // Set the user in the request
    req.user = decoded;
    
    // Try to fetch the full user from database if we have an ID
    if (decoded._id || decoded.id || decoded.userId) {
      const userId = decoded._id || decoded.id || decoded.userId;
      try {
        const user = await User.findById(userId);
        if (user) {
          console.log('Found user in DB:', user.name || user.username || user.email);
          // Merge database user data with token data
          req.user = { 
            ...decoded,
            name: user.name || user.username || user.email.split('@')[0],
            email: user.email
          };
        } else {
          console.log('User not found in database despite valid token');
        }
      } catch (dbError) {
        console.error('Error fetching user from database:', dbError.message);
        // Continue with token data only
      }
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 