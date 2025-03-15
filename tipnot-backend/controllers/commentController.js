const Comment = require('../models/comment');

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { text } = req.body;
    
    console.log('Request user:', req.user);
    console.log('Adding comment for contentId:', contentId);
    console.log('Comment text:', text);
    
    // Check if we have all required data
    if (!contentId) {
      return res.status(400).json({ message: 'Content ID is required' });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    // Create a comment object with safe fallbacks for user
    const commentData = {
      content: contentId,
      text: text,
    };
    
    // Check auth token and get user information
    if (req.user) {
      console.log('User from token:', req.user);
      
      // If we have a userId or _id in the token, use it
      if (req.user._id) {
        commentData.user = req.user._id;
        console.log('Using _id from token:', req.user._id);
      } else if (req.user.id) {
        commentData.user = req.user.id;
        console.log('Using id from token:', req.user.id);
      } else if (req.user.userId) {
        commentData.user = req.user.userId;
        console.log('Using userId from token:', req.user.userId);
      } else {
        console.warn('Token has user object but no recognizable ID field');
      }
      
      // Also include user information directly for display
      if (req.user.name) {
        commentData.userName = req.user.name;
      } else if (req.user.username) {
        commentData.userName = req.user.username;
      } else if (req.user.email) {
        // Use email as fallback for name (before @ symbol)
        commentData.userName = req.user.email.split('@')[0];
      }
    } else {
      console.warn('No authenticated user found in request');
    }
    
    console.log('Final comment data being saved:', commentData);
    
    // Create and save the comment
    const comment = new Comment(commentData);
    const savedComment = await comment.save();
    console.log('Saved comment:', savedComment);
    
    // Populate the user information for the response
    const populatedComment = await Comment.findById(savedComment._id).populate('user', 'name email username');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Server error when adding comment',
      error: error.message 
    });
  }
};

// Fetch comments for content
exports.getComments = async (req, res) => {
  try {
    const { contentId } = req.params;
    console.log('Fetching comments for contentId:', contentId);
    
    // Get comments with populated user data (if available)
    const comments = await Comment.find({ content: contentId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email username');
    
    console.log(`Found ${comments.length} comments for content ID ${contentId}`);
    
    // Format the comments to ensure proper user information
    const formattedComments = comments.map(comment => {
      // Convert to plain object so we can modify it
      const formattedComment = comment.toObject();
      
      // Make sure we have a userName
      if (!formattedComment.userName && formattedComment.user) {
        formattedComment.userName = 
          formattedComment.user.name || 
          formattedComment.user.username || 
          (formattedComment.user.email ? formattedComment.user.email.split('@')[0] : null);
      }
      
      if (!formattedComment.userName) {
        formattedComment.userName = 'Anonymous User';
      }
      
      return formattedComment;
    });
    
    res.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete own comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Comment.deleteOne({ _id: id });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 