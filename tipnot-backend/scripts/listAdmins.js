const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medicalEducation', {})
  .then(() => {
    console.log('Connected to MongoDB');
    listAdmins();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function listAdmins() {
  try {
    // Find all users with role 'admin'
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    console.log('\n===== ADMIN USERS =====');
    
    if (admins.length === 0) {
      console.log('No admin users found in the database.');
    } else {
      admins.forEach((admin, index) => {
        console.log(`\n--- Admin #${index + 1} ---`);
        console.log(`Username: ${admin.username}`);
        console.log(`Email: ${admin.email}`);
        console.log(`ID: ${admin._id}`);
        console.log(`Created: ${admin._id.getTimestamp()}`);
      });
      
      console.log(`\nTotal admins found: ${admins.length}`);
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error listing admin users:', error);
  } finally {
    process.exit(0);
  }
} 