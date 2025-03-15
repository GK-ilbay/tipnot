const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/user');
const Comment = require('../models/comment');
const Content = require('../models/content_model');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Configure multer for file uploads (memory storage instead of disk)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Route to create an admin user - should be secured in production
router.post('/create-admin', authController.createAdmin);

// Direct admin creation endpoint (for testing only - remove in production)
router.post('/create-test-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Creating test admin with:', { username, email });
    
    // Input validation
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with this email');
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      username,
      email: email.toLowerCase(), // Ensure email is lowercase
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Test admin created successfully:', username);
    
    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        username,
        email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error creating test admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test login endpoint (for debugging only - remove in production)
router.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test login attempt with:', { email });
    
    if (!email || !password) {
      console.log('Test login: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user with case-insensitive email
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    
    if (!user) {
      console.log('Test login: No user found with email', email);
      return res.status(400).json({ message: 'User not found' });
    }
    
    console.log('Test login: User found -', 
      `Username: ${user.username}`, 
      `Role: ${user.role}`,
      `Email: ${user.email}`
    );
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Test login: Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    
    res.json({ 
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== PROTECTED ADMIN ROUTES =====
// All routes below this point require authentication and admin role

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || (role !== 'user' && role !== 'admin')) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes for comment management
router.get('/comments', adminMiddleware, async (req, res) => {
  try {
    // Get all comments with pagination and filtering options
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const comments = await Comment.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('user', 'name email username')
      .populate('content', 'title');
    
    const total = await Comment.countDocuments(query);
    
    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching comments for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment status or user information
router.put('/comments/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, userName } = req.body;
    
    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    
    if (userName) {
      updateData.userName = userName;
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    ).populate('user', 'name email username');
    
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category
router.post(
  '/category', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const { title, description, parentPath = '/' } = req.body;
      console.log('Creating category:', { title, description, parentPath });
      console.log('User info from request:', req.user);
      
      if (!title) {
        return res.status(400).json({ message: 'Category title is required' });
      }
      
      // Determine the correct collection name
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log('Available collections:', collectionNames);
      
      // Find the correct collection name (could be 'contents' or 'content')
      const collectionName = collections.find(c => 
        c.name === 'contents' || c.name === 'content' || c.name === 'Content'
      )?.name || 'contents';
      
      console.log('Using collection name:', collectionName);
      
      // Calculate new path - sanitize title for path usage
      const sanitizedTitle = title.trim().replace(/\//g, '-').replace(/\s+/g, '-');
      const newPath = parentPath === '/' 
        ? `/${sanitizedTitle}` 
        : `${parentPath}/${sanitizedTitle}`;
      
      console.log('New category path:', newPath);
      
      // Check if category path already exists
      const existingCategory = await mongoose.connection.collection(collectionName).findOne({ 
        categoryPath: newPath,
        isCategory: { $in: [true, 'true'] } // Check for both boolean true and string 'true'
      });
      
      if (existingCategory) {
        console.log('Category already exists:', existingCategory);
        return res.status(400).json({ message: 'Category with this name already exists at this level' });
      }

      // Get the user ID from the JWT token
      const userId = req.user.userId;
      
      if (!userId) {
        console.error('User ID not found in request:', req.user);
        return res.status(400).json({ message: 'User authentication error - missing user ID' });
      }
      
      // Create new category document with explicit true boolean
      const categoryData = {
        title,
        description: description || `${title} category`,
        content: `Category: ${title}`,
        author: new mongoose.Types.ObjectId(userId),
        categoryPath: newPath,
        isCategory: true, // Make sure this is a boolean true
        category: 'general',
        views: 0,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('New category document to insert:', categoryData);
      
      // Insert directly to collection
      const result = await mongoose.connection.collection(collectionName).insertOne(categoryData);
      console.log('Insert result:', result);
      
      // Verify the category was saved
      const savedCategory = await mongoose.connection.collection(collectionName).findOne({ _id: result.insertedId });
      console.log('Saved category document:', savedCategory);
      
      // Verify that isCategory is true and it's a boolean
      console.log('isCategory value type:', typeof savedCategory.isCategory);
      console.log('isCategory value:', savedCategory.isCategory);
      
      // Return the saved document
      res.status(201).json(savedCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get categories and content at a specific path
router.get(
  '/content-structure', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const { path = '/' } = req.query;
      console.log('Fetching content structure for path:', path);

      // Get the database name from the connection or use medicalEducation
      const dbName = mongoose.connection.name || 'medicalEducation';
      console.log('Current database name:', dbName);

      // Debug: Get all collection names to double check the correct collection name
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections in current DB:', collections.map(c => c.name));
      
      // Use the medicalEducation database if available
      const collectionName = 'contents';
      console.log('Using collection:', dbName + '.' + collectionName);

      // Check all documents to see what's in the database
      const allDocs = await mongoose.connection.collection(collectionName).find({}).toArray();
      console.log('Total documents in collection:', allDocs.length);
      
      if (allDocs.length > 0) {
        // Log details of each document
        allDocs.forEach((doc, index) => {
          console.log(`Document ${index}:`, {
            _id: doc._id,
            title: doc.title,
            isCategory: doc.isCategory,
            categoryPath: doc.categoryPath
          });
        });
      } else {
        console.log('No documents found in collection');
      }

      // Find direct children without using regex
      let directChildren = [];
      let exactPathContents = [];
      let exactPathCategory = null;
      
      // First, see if we're looking at a specific category
      exactPathCategory = allDocs.find(doc => 
        doc.categoryPath === path && 
        (doc.isCategory === true || doc.isCategory === 'true' || String(doc.isCategory).toLowerCase() === 'true')
      );
      
      // If we're at a specific category, find its contents
      if (exactPathCategory) {
        console.log(`Found exact category match: ${exactPathCategory.title}`);
        // Find content that has the same categoryPath as this category
        exactPathContents = allDocs.filter(doc => 
          doc.categoryPath === path && 
          !doc.isCategory && 
          doc.isCategory !== 'true' && 
          String(doc.isCategory).toLowerCase() !== 'true'
        );
        console.log(`Found ${exactPathContents.length} content items in this category`);
      }
      
      if (path === '/') {
        // For root path, get only direct children, not deeply nested ones
        directChildren = allDocs.filter(doc => {
          // A root-level entry should have a categoryPath that:
          // 1. Starts with a slash
          // 2. Has exactly one slash (at the beginning)
          // 3. Is not just "/"
          const docPath = doc.categoryPath || '';
          return docPath.startsWith('/') && 
                 docPath !== '/' && 
                 !docPath.substring(1).includes('/');
        });
        
        // Also get content items that are placed directly at the root
        exactPathContents = allDocs.filter(doc => {
          return (doc.categoryPath === '/' || doc.categoryPath === '') && 
                 !doc.isCategory && 
                 doc.isCategory !== 'true' && 
                 String(doc.isCategory).toLowerCase() !== 'true';
        });
      } else {
        // For non-root paths, get direct children of this path
        directChildren = allDocs.filter(doc => {
          const docPath = doc.categoryPath || '';
          // Direct children have the parent path followed by slash + something
          // without any further slashes
          return docPath.startsWith(path + '/') && 
                 !docPath.substring(path.length + 1).includes('/');
        });
        
        // We already got the exact path contents above when checking for the category
      }
      
      console.log('Found direct children:', directChildren.length);
      console.log('Found exact path contents:', exactPathContents.length);
      
      // Separate categories and content from direct children
      const categories = directChildren.filter(item => 
        item.isCategory === true || 
        item.isCategory === 'true' || 
        String(item.isCategory).toLowerCase() === 'true'
      );
      
      // Combine direct child content with exact path content
      const childContents = directChildren.filter(item => 
        !item.isCategory && 
        item.isCategory !== 'true' && 
        String(item.isCategory).toLowerCase() !== 'true'
      );
      
      const contents = [...childContents, ...exactPathContents];
      
      console.log('Categories after filtering:', categories.length, 'Contents:', contents.length);
      console.log('Category documents:', categories.map(c => ({ title: c.title, path: c.categoryPath })));
      
      res.json({
        currentPath: path,
        categories,
        contents,
        isEmpty: categories.length === 0 && contents.length === 0,
        currentCategory: exactPathCategory || null
      });
    } catch (error) {
      console.error('Error fetching content structure:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Create content (updated to support category paths)
router.post(
  '/content', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('image'), 
  async (req, res) => {
    try {
      const { title, description, content, category, categoryPath = '/', isNewContent } = req.body;
      
      console.log('Creating content with categoryPath:', categoryPath);
      
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }
      
      // Determine the correct collection name
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionName = collections.find(c => 
        c.name === 'contents' || c.name === 'content' || c.name === 'Content'
      )?.name || 'contents';
      
      console.log('Using collection name for content creation:', collectionName);
      
      // Get the user ID from the JWT token
      const userId = req.user.userId;
      
      // Adjust the categoryPath to place content inside categories
      let finalCategoryPath = categoryPath;
      
      // If this is new content, we want to place it INSIDE the category
      // by adding a subcategory in the path that represents this content
      if (isNewContent === 'true') {
        // Get the category document based on categoryPath
        const categoryDoc = await mongoose.connection.collection(collectionName).findOne({
          categoryPath: categoryPath,
          isCategory: { $in: [true, 'true'] }
        });
        
        if (categoryDoc) {
          console.log('Found parent category:', categoryDoc.title);
          // Keep the content at the same path as its parent category
        } else {
          console.log('No parent category found, this content will be at the root level');
        }
      }
      
      // Prepare content document
      const contentData = {
        title,
        description: description || '',
        content,
        category: category || 'general',
        categoryPath: finalCategoryPath, // Use the adjusted path
        author: new mongoose.Types.ObjectId(userId),
        isCategory: false, // Make sure this is a boolean false
        views: 0,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating content document with path:', contentData.categoryPath);
      
      // Add image data if provided
      if (req.file) {
        contentData.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        };
      }
      
      // Insert directly to collection
      const result = await mongoose.connection.collection(collectionName).insertOne(contentData);
      console.log('Content insert result:', result);
      
      // Verify the content was saved with the correct path
      const savedContent = await mongoose.connection.collection(collectionName).findOne({ _id: result.insertedId });
      console.log('Saved content categoryPath:', savedContent.categoryPath);
      
      // Return the content without the image data
      const contentResponse = {...contentData};
      if (contentResponse.image) {
        contentResponse.hasImage = true;
        delete contentResponse.image.data; // Don't send image data in response
      }
      
      res.status(201).json(contentResponse);
    } catch (error) {
      console.error('Error creating content:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Update content
router.put(
  '/content/:id', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('image'), 
  async (req, res) => {
    try {
      const { title, description, content, category, categoryPath } = req.body;
      const contentId = req.params.id;
      
      // Find existing content
      const existingContent = await Content.findById(contentId);
      if (!existingContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      // Update fields
      if (title) existingContent.title = title;
      if (description) existingContent.description = description;
      if (content) existingContent.content = content;
      if (category) existingContent.category = category;
      if (categoryPath) existingContent.categoryPath = categoryPath;
      
      // Update image if provided
      if (req.file) {
        existingContent.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        };
      }
      
      await existingContent.save();
      
      // Return the content without the image data
      const contentResponse = existingContent.toObject();
      if (contentResponse.image) {
        contentResponse.hasImage = true;
        delete contentResponse.image.data;
      }
      
      res.json(contentResponse);
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Add a route to get image data separately
router.get('/content/:id/image', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content || !content.image || !content.image.data) {
      return res.status(404).send('Image not found');
    }
    
    res.set('Content-Type', content.image.contentType);
    res.send(content.image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for uploading featured image separately
router.post('/content/:id/featured-image', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('image'), 
  async (req, res) => {
    try {
      console.log('Uploading featured image for content ID:', req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
      
      // Find content by ID
      const content = await Content.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      // Update image data
      content.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
      
      await content.save();
      
      console.log('Featured image uploaded successfully for content:', content.title);
      res.json({ 
        message: 'Featured image uploaded successfully',
        contentId: content._id,
        filename: req.file.originalname
      });
    } catch (error) {
      console.error('Error uploading featured image:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Route for uploading content images separately
router.post('/content/:id/content-image', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('image'), 
  async (req, res) => {
    try {
      console.log('Uploading content image for content ID:', req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
      
      // Get the imageId from request body
      const { imageId } = req.body;
      if (!imageId) {
        return res.status(400).json({ message: 'Image ID is required' });
      }
      
      // Find content by ID
      const content = await Content.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      // Initialize contentImages array if it doesn't exist
      if (!content.contentImages) {
        content.contentImages = [];
      }
      
      // Add image to contentImages array
      content.contentImages.push({
        id: imageId,
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      });
      
      await content.save();
      
      console.log('Content image uploaded successfully for ID:', imageId);
      res.json({ 
        message: 'Content image uploaded successfully',
        contentId: content._id,
        imageId: imageId,
        filename: req.file.originalname
      });
    } catch (error) {
      console.error('Error uploading content image:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Add a test endpoint to create and verify a category
router.get('/test-category', async (req, res) => {
  try {
    // Get the database name
    const dbName = mongoose.connection.name || 'medicalEducation';
    console.log('Current database name:', dbName);
    
    // Directly use the contents collection
    const collectionName = 'contents';
    console.log('Using collection:', dbName + '.' + collectionName);
    
    // Create a test category document
    const testCategory = {
      title: 'Test Category from API',
      description: 'This is a test category created directly via API',
      content: 'Category: Test',
      categoryPath: '/test-api-category',
      isCategory: true,
      category: 'general',
      views: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert directly to collection
    const collection = mongoose.connection.collection(collectionName);
    await collection.insertOne(testCategory);
    console.log('Test category created');
    
    // Get all categories to verify
    const allCategories = await collection.find({ isCategory: true }).toArray();
    
    // Get categories at root level
    const rootCategories = allCategories.filter(cat => {
      const path = cat.categoryPath || '';
      return path.startsWith('/') && path !== '/' && !path.substring(1).includes('/');
    });
    
    // Send response with all found categories
    res.json({
      message: 'Test category created',
      allCategories: allCategories.map(c => ({ 
        title: c.title, 
        path: c.categoryPath,
        isCategory: c.isCategory
      })),
      rootCategories: rootCategories.map(c => ({ 
        title: c.title, 
        path: c.categoryPath,
        isCategory: c.isCategory
      }))
    });
  } catch (error) {
    console.error('Error in test-category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 