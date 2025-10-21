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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
