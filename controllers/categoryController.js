const Category = require('../models/Category');
const Product = require('../models/Product');

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

    const category = new Category({
      name: name.trim(),
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

    await category.save();

    // Populate parent if exists
    await category.populate('parent', 'name');

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
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
