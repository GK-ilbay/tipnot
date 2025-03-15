const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Content schema
const ContentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  categoryPath: {
    type: String,
    default: '/'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isCategory: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Featured image
  image: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  // Video URL if any
  videoUrl: {
    type: String,
    default: ''
  },
  // Array of content images
  contentImages: [{
    id: String,
    data: Buffer,
    contentType: String,
    filename: String
  }],
  // References list
  references: [{
    type: String
  }]
});

// Update the updatedAt field before saving
ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  console.log('Saving content document:', {
    id: this._id,
    title: this.title,
    isCategory: this.isCategory,
    categoryPath: this.categoryPath
  });
  next();
});

// Create and export the model
const Content = mongoose.model('Content', ContentSchema);

module.exports = Content; 