const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: Object,
    required: true
  },
  subDescription: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  metals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Metal'
  }],
  stoneType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stone'
  },
  careInstruction: {
    type: String,
    trim: true
  },
  shape: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  clarity: {
    type: [String],
    default: []
  },
  certificate: {
    type: [String],
    default: []
  },
  isBand: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
