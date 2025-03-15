const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medicalEducation', {})
  .then(() => {
    console.log('Connected to MongoDB');
    resetPassword();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function resetPassword() {
  try {
    // First list all admin users to choose from
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    if (admins.length === 0) {
      console.log('No admin users found in the database.');
      process.exit(0);
    }
    
    console.log('\n===== ADMIN USERS =====');
    admins.forEach((admin, index) => {
      console.log(`[${index + 1}] ${admin.username} (${admin.email})`);
    });
    
    // Ask which admin to reset
    const adminIndexStr = await question('\nEnter the number of the admin user to reset password: ');
    const adminIndex = parseInt(adminIndexStr) - 1;
    
    if (isNaN(adminIndex) || adminIndex < 0 || adminIndex >= admins.length) {
      console.log('Invalid selection.');
      process.exit(1);
    }
    
    const selectedAdmin = admins[adminIndex];
    console.log(`\nResetting password for: ${selectedAdmin.username} (${selectedAdmin.email})`);
    
    // Get new password
    const newPassword = await question('Enter new password: ');
    
    if (!newPassword || newPassword.length < 6) {
      console.log('Password must be at least 6 characters long.');
      process.exit(1);
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update admin's password
    await User.findByIdAndUpdate(selectedAdmin._id, { password: hashedPassword });
    
    console.log(`\nPassword for ${selectedAdmin.username} has been successfully reset.`);
    console.log('New login credentials:');
    console.log(`Email: ${selectedAdmin.email}`);
    console.log(`Password: ${newPassword}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
}

// Helper function to prompt for input
function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });
} 