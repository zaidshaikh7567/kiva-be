const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    type: String, // File paths to uploaded images
    trim: true
  }]
}, {
  timestamps: true
});

// Ensure category exists before saving product
productSchema.pre('save', async function(next) {
  const Category = mongoose.model('Category');
  const category = await Category.findById(this.category);
  if (!category) {
    return next(new Error('Category does not exist'));
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
