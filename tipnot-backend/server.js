const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8000;

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// CORS middleware configuration
app.use(cors({
  origin: isProduction 
    ? ['https://tipnot-v2.onrender.com', 'https://tipnot.net', 'https://www.tipnot.net', process.env.FRONTEND_URL].filter(Boolean) 
    : ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:8000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection string - use environment variable in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicalEducation';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  // Remove deprecated options
});

// Check connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Clear require cache for problematic models
Object.keys(require.cache).forEach(key => {
  if (key.toLowerCase().includes('models/content')) {
    delete require.cache[key];
  }
});

// Preload all models (IMPORTANT: load models first before routes)
require('./models/user');
require('./models/content_model');
require('./models/comment');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// HTTP request logger
app.use(morgan('dev'));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Direct image handling route to bypass any middleware issues
app.get('/direct-image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log('Direct image request for ID:', imageId);
    
    // Get Content model directly
    const Content = mongoose.model('Content');
    
    // Find the image
    const content = await Content.findOne({ "contentImages.id": imageId });
    
    if (!content) {
      console.log('No content found with image ID:', imageId);
      return res.status(404).send('Content with this image not found');
    }
    
    const image = content.contentImages.find(img => img.id === imageId);
    
    if (!image || !image.data) {
      console.log('Image data not found for ID:', imageId);
      return res.status(404).send('Image not found');
    }
    
    console.log('Image found, sending with content type:', image.contentType);
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error('Error in direct image route:', error);
    res.status(500).send('Error loading image');
  }
});

// Debug endpoint to list all content images
app.get('/debug-content-images', async (req, res) => {
  try {
    // Get Content model
    const Content = mongoose.model('Content');
    
    // Find all contents with images
    const contents = await Content.find({ "contentImages.0": { $exists: true } });
    
    const result = contents.map(content => ({
      id: content._id,
      title: content.title,
      contentImagesCount: content.contentImages?.length || 0,
      images: content.contentImages?.map(img => ({
        id: img.id,
        contentType: img.contentType,
        filename: img.filename,
        hasData: !!img.data,
        dataSize: img.data ? img.data.length + ' bytes' : 'no data'
      })) || []
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error in debug content images route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/content');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/user');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

// Mount routes with proper prefixes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);  // This includes the /content-image/:imageId route
app.use('/api', commentRoutes);
app.use('/api', userRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve the React frontend
if (isProduction) {
  // Check if the directory exists in production
  const frontendBuildPath = path.resolve(__dirname, '../tipnot-frontend/build');
  
  console.log('Checking for frontend build at:', frontendBuildPath);
  
  // Serve the static files from the React app build folder
  app.use(express.static(frontendBuildPath));
  
  // For any routes not handled above, return the React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/direct-image') || 
        req.path.startsWith('/debug')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Special debug route to log image URLs
app.get('/debug-image/:imageId', (req, res) => {
  console.log('Debug image request for ID:', req.params.imageId);
  res.send(`Image ID received: ${req.params.imageId}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
}); 