const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const mongoose = require('mongoose');

// IMPORTANT: Public route for content images - NO AUTH REQUIRED
// This must be defined before other routes to ensure it's accessible
router.get('/content-image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log('Fetching content image with ID:', imageId);
    
    // Get Content model
    const Content = mongoose.model('Content');
    
    // Log all contentImages in database for debugging
    const allContentsWithImages = await Content.find({ "contentImages.0": { $exists: true } });
    console.log(`Found ${allContentsWithImages.length} contents with images in database`);
    if (allContentsWithImages.length > 0) {
      allContentsWithImages.forEach((c, idx) => {
        console.log(`Content ${idx + 1}: "${c.title}" has ${c.contentImages?.length || 0} images`);
        if (c.contentImages && c.contentImages.length > 0) {
          c.contentImages.forEach((img, imgIdx) => {
            console.log(`  - Image ${imgIdx + 1}: id=${img.id}, type=${img.contentType}, size=${img.data ? img.data.length + ' bytes' : 'no data'}`);
          });
        }
      });
    }
    
    // Find the content document containing this image ID
    const content = await Content.findOne({
      "contentImages.id": imageId
    });
    
    if (!content) {
      console.log('No content found with image ID:', imageId);
      return res.status(404).send('Content with this image not found');
    }
    
    console.log('Found content document with title:', content.title);
    
    // Find the specific image in the contentImages array
    const image = content.contentImages.find(img => img.id === imageId);
    
    if (!image || !image.data) {
      console.log('Image data not found for ID:', imageId);
      return res.status(404).send('Image not found');
    }
    
    console.log('Found image data with type:', image.contentType, 'and size:', image.data.length, 'bytes');
    
    // Set proper cache headers for better performance
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.set('Content-Type', image.contentType);
    res.send(image.data);
    console.log('Image sent successfully');
  } catch (error) {
    console.error('Error fetching content image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create content with image upload
router.post('/content', authMiddleware, adminMiddleware, upload.array('images'), contentController.createContent);

// Get all content
router.get('/content', authMiddleware, contentController.getAllContent);

// Get single content by ID
router.get('/content/:id', authMiddleware, contentController.getContentById);

// Update content
router.put('/content/:id', authMiddleware, adminMiddleware, contentController.updateContent);

// Delete content
router.delete('/content/:id', authMiddleware, adminMiddleware, contentController.deleteContent);

// Image upload route
router.post('/content/upload', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  try {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content structure by path (categories and content)
router.get('/content-structure', async (req, res) => {
  try {
    const { path = '/' } = req.query;
    console.log('Fetching content structure for path:', path);

    // Get the database name
    const dbName = mongoose.connection.name || 'medicalEducation';
    console.log('Current database name:', dbName);

    // Use the contents collection
    const collectionName = 'contents';
    console.log('Using collection:', dbName + '.' + collectionName);

    // Get all documents to filter client-side
    const allDocs = await mongoose.connection.collection(collectionName).find({}).toArray();
    console.log('Total documents in collection:', allDocs.length);
    
    // Log all docs for debugging
    allDocs.forEach((doc, index) => {
      console.log(`Document ${index}:`, {
        _id: doc._id,
        title: doc.title,
        isCategory: doc.isCategory,
        categoryPath: doc.categoryPath
      });
    });
    
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
        const docPath = doc.categoryPath || '';
        return docPath.startsWith('/') && 
               docPath !== '/' && 
               !docPath.substring(1).includes('/');
      });
      
      // Also get content items that are placed directly at the root
      if (!exactPathContents.length) {
        exactPathContents = allDocs.filter(doc => {
          return (doc.categoryPath === '/' || doc.categoryPath === '') && 
                 !doc.isCategory && 
                 doc.isCategory !== 'true' && 
                 String(doc.isCategory).toLowerCase() !== 'true';
        });
      }
    } else {
      // For non-root paths, get direct children of this path
      directChildren = allDocs.filter(doc => {
        const docPath = doc.categoryPath || '';
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
});

module.exports = router; 