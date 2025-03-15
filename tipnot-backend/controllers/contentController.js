const Content = require('../models/content_model');

// Create new content
exports.createContent = async (req, res) => {
  try {
    console.log('Creating content from controller with body:', req.body);
    
    // Extract basic content data
    const { title, content, categoryPath, videoUrl } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Create content document
    const contentDoc = new Content({
      title,
      content,
      categoryPath: categoryPath || '/',
      author: req.user.userId, // Should be set by auth middleware
      videoUrl: videoUrl || '',
      isCategory: false
    });
    
    // Save to database
    await contentDoc.save();
    
    // Return success response
    res.status(201).json({
      message: 'Content created successfully',
      _id: contentDoc._id,
      title: contentDoc.title
    });
  } catch (error) {
    console.error('Error in createContent controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all content with pagination and search
exports.getAllContent = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { title: new RegExp(search, 'i') } : {};

    const content = await Content.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Content.countDocuments(query);

    res.json({
      content,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single content by ID
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const { title, body, images, categories, videoUrl } = req.body;
    const content = await Content.findByIdAndUpdate(req.params.id, {
      title,
      body,
      images,
      categories,
      videoUrl,
    }, { new: true });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 