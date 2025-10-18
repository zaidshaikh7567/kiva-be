const express = require('express');

const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { createCategorySchema, updateCategorySchema, categoryIdSchema } = require('../validations/category');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');

const upload = createMulter({ storage: 'cloudinary', allowedFormats: ['jpg', 'png', 'jpeg'], maxSize: 2 * 1024 * 1024, folder: 'categories' });

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find().populate('parent');
  res.json({ success: true, message: 'Categories retrieved successfully', data: categories });
}));

router.post('/', upload.single('image'), validate(createCategorySchema), asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;
  const image = req.file ? req.file.path : null;

  if (!image) {
    throw new Error('Image is required');
  }

  const category = new Category({
    name,
    image,
    parent: parentId || null
  });

  await category.save();

  res.status(201).json({ success: true, message: 'Category created successfully', data: category });
}));

router.get('/:id', validate(categoryIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('parent');
  if (!category) throw new Error('Category not found');
  res.json({ success: true, message: 'Category retrieved successfully', data: category });
}));

router.put('/:id', upload.single('image'), validate(categoryIdSchema, 'params'), validate(updateCategorySchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  let updateData = {};
  if (name !== undefined) updateData.name = name;
  if (parentId !== undefined) updateData.parent = parentId || null;
  if (req.file) updateData.image = req.file.path;

  const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
  if (!category) throw new Error('Category not found');

  res.json({ success: true, message: 'Category updated successfully', data: category });
}));

router.delete('/:id', validate(categoryIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error('Category not found');
  res.json({ success: true, message: 'Category deleted successfully' });
}));

module.exports = router;
