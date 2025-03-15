const Feedback = require('../models/feedback');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = new Feedback({ name, email, message });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all feedback (Admin-only)
exports.getAllFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 