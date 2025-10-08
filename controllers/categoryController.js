const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Configure multer for category image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp for category
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const uploadCategoryImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Helper function to delete category image file
const deleteCategoryImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '..', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

exports.uploadCategoryImage = uploadCategoryImage.single('image');

exports.createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if parent exists if provided
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(404).json({ error: 'Parent category not found' });
      }
      // Ensure only one level of nesting
      if (parent.parent) {
        return res.status(400).json({ error: 'Cannot create subcategory of a subcategory' });
      }
    }

    // Get uploaded file path if exists
    const imagePath = req.file ? req.file.path : null;

    const category = new Category({
      name: name.trim(),
      image: imagePath,
      parent: parentId || null
    });

    await category.save();

    // Populate parent if exists
    await category.populate('parent', 'name');

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);

    // Clean up uploaded file if category creation fails
    if (req.file) {
      deleteCategoryImage(req.file.path);
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate('parent', 'name');
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (name) {
      category.name = name.trim();
    }

    if (parentId !== undefined) {
      if (parentId) {
        // Check if parent exists
        const parent = await Category.findById(parentId);
        if (!parent) {
          return res.status(404).json({ error: 'Parent category not found' });
        }
        // Ensure only one level of nesting
        if (parent.parent) {
          return res.status(400).json({ error: 'Cannot set subcategory as parent' });
        }
      }
      category.parent = parentId || null;
    }

    // Handle image update
    if (req.file) {
      // Delete existing image if present
      if (category.image) {
        deleteCategoryImage(category.image);
      }
      // Set new image
      category.image = req.file.path;
    }

    await category.save();

    // Populate parent if exists
    await category.populate('parent', 'name');

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);

    // Clean up uploaded file if update fails
    if (req.file) {
      deleteCategoryImage(req.file.path);
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parent: id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with subcategories. Delete subcategories first.'
      });
    }

    // Check if category has products
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with products. Move or delete products first.'
      });
    }

    // Delete associated image file
    if (category.image) {
      deleteCategoryImage(category.image);
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
