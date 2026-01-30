const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  video: {
    type: String,
    default: null,   // 👈 optional
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);
