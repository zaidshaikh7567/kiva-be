const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, {
  timestamps: true
});

// Ensure no circular references and one level nesting only
categorySchema.pre('save', async function(next) {
  if (this.parent) {
    const parentCategory = await mongoose.model('Category').findById(this.parent);
    if (!parentCategory) {
      return next(new Error('Parent category does not exist'));
    }
    if (parentCategory.parent) {
      return next(new Error('Cannot create subcategory of a subcategory'));
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
