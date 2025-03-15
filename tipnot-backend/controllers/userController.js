const User = require('../models/user');
const Content = require('../models/content_model');

// Add content to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { contentId } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user.favorites.includes(contentId)) {
      user.favorites.push(contentId);
      await user.save();
    }

    res.json({ message: 'Content added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove content from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    user.favorites = user.favorites.filter(contentId => contentId.toString() !== id);
    await user.save();

    res.json({ message: 'Content removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's favorite content list
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Save reading progress
exports.saveProgress = async (req, res) => {
  try {
    const { contentId, lastPosition } = req.body;
    const user = await User.findById(req.user.userId);

    const progressIndex = user.readingProgress.findIndex(progress => progress.contentId.toString() === contentId);

    if (progressIndex !== -1) {
      user.readingProgress[progressIndex].lastPosition = lastPosition;
    } else {
      user.readingProgress.push({ contentId, lastPosition });
    }

    await user.save();
    res.json({ message: 'Reading progress saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reading progress for specific content
exports.getProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    const progress = user.readingProgress.find(progress => progress.contentId.toString() === id);

    res.json(progress || { message: 'No progress found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 