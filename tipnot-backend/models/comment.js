const mongoose = require('mongoose');

// Try to get the existing model first
try {
  module.exports = mongoose.model('Comment');
} catch (e) {
  // Define the model only if it doesn't exist
  const commentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Optional to allow anonymous comments
    },
    userName: {
      type: String,
      default: 'Anonymous User' // Fallback display name
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('Comment', commentSchema);
} 