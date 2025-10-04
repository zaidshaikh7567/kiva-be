const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Helper function to delete files
const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};

exports.uploadImages = upload.array('images', 10);

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId } = req.body;

    // Validate required fields
    if (!title || !price || !quantity || !categoryId) {
      return res.status(400).json({ error: 'Title, price, quantity, and category are required' });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get uploaded file paths
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      title: title.trim(),
      description: description ? description.trim() : '',
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: categoryId,
      images: imagePaths
    });

    await product.save();
    await product.populate('category', 'name');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Clean up uploaded files if product creation fails
    if (req.files) {
      const filePaths = req.files.map(file => file.path);
      deleteFiles(filePaths);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'category',
      sort: { createdAt: -1 }
    };

    // For simplicity, using skip/limit instead of pagination library
    const skip = (options.page - 1) * options.limit;
    const products = await Product.find(query)
      .populate('category', 'name parent')
      .sort(options.sort)
      .skip(skip)
      .limit(options.limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name parent');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, categoryId, existingImages = [] } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      product.category = categoryId;
    }

    // Update basic fields
    if (title) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price) product.price = parseFloat(price);
    if (quantity !== undefined) product.quantity = parseInt(quantity);

    // Handle images: combine existing and new uploaded images
    let currentImages = [];
    if (typeof existingImages === 'string') {
      currentImages = [existingImages];
    } else if (Array.isArray(existingImages)) {
      currentImages = existingImages;
    }

    const newImages = req.files ? req.files.map(file => file.path) : [];
    product.images = [...currentImages, ...newImages];

    await product.save();
    await product.populate('category', 'name parent');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);

    // Clean up uploaded files if update fails
    if (req.files) {
      const filePaths = req.files.map(file => file.path);
      deleteFiles(filePaths);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated image files
    if (product.images && product.images.length > 0) {
      deleteFiles(product.images);
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
