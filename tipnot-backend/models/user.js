const mongoose = require('mongoose');

// Try to get the existing model first
try {
  module.exports = mongoose.model('User');
} catch (e) {
  // Define the model only if it doesn't exist
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    }],
    readingProgress: [{
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
      },
      lastPosition: {
        type: String, // or Number, depending on your needs
      },
    }],
  });
  
  module.exports = mongoose.model('User', userSchema);
} 