const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register a new user
exports.register = async (req, res) => {
  try {
    // Add logging to see what's coming in
    console.log('Registration request body:', req.body);
    
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, email, and password are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address.' 
      });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false,
          message: 'User with this email already exists.' 
        });
      } else {
        return res.status(400).json({ 
          success: false,
          message: 'Username is already taken.' 
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      role: 'user'
    });
    
    await user.save();

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      return res.status(400).json({ 
        success: false,
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'An error occurred during registration. Please try again later.',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email (convert to lowercase)
    const normalizedEmail = email.toLowerCase();
    console.log('Normalized email for search:', normalizedEmail);
    
    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Login failed: No user found with email', normalizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', user.username, 'Role:', user.role);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Login failed: Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return user info (excluding password) along with token
    const userToReturn = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    console.log('Login successful for user:', user.username);
    res.json({ 
      token,
      user: userToReturn
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create an admin user
exports.createAdmin = async (req, res) => {
  try {
    // This endpoint should be secure and only accessible to existing admins
    // or through a secure setup process
    
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, email, and password are required.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({ 
      username, 
      email, 
      password: hashedPassword,
      role: 'admin' // Set role as admin
    });
    
    await adminUser.save();

    res.status(201).json({ 
      success: true,
      message: 'Admin user created successfully' 
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
}; 