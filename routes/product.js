const express = require('express');

const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { createProductSchema, updateProductSchema, productIdSchema } = require('../validations/product');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');

const upload = createMulter({ storage: 'cloudinary', allowedFormats: ['jpg', 'png', 'jpeg'], maxSize: 2 * 1024 * 1024, folder: 'products' });

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find().populate(['category', 'metals', 'stoneType']);
  res.json({ success: true, message: 'Products retrieved successfully', data: products });
}));

router.post('/', upload.array('images', 10), validate(createProductSchema), asyncHandler(async (req, res) => {
  const { title, description, subDescription, price, quantity, categoryId, metalIds, stoneTypeId, careInstruction } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  if (images.length === 0) {
    throw new Error('At least one image is required');
  }

  const parsedDescription = JSON.parse(description);

  const product = new Product({
    title,
    description: parsedDescription,
    subDescription,
    price,
    quantity,
    category: categoryId,
    images,
    metals: metalIds || [],
    stoneType: stoneTypeId,
    careInstruction
  });

  await product.save();
  await product.populate(['category', 'metals', 'stoneType']);

  res.status(201).json({ success: true, message: 'Product created successfully', data: product });
}));

router.get('/:id', validate(productIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate(['category', 'metals', 'stoneType']);
  if (!product) throw new Error('Product not found');
  res.json({ success: true, message: 'Product retrieved successfully', data: product });
}));

router.put('/:id', upload.array('images', 10), validate(productIdSchema, 'params'), validate(updateProductSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryId, description, metalIds, stoneTypeId, careInstruction, ...updateData } = req.body;

  if (categoryId !== undefined) {
    updateData.category = categoryId;
  }

  if (description !== undefined) {
    updateData.description = JSON.parse(description);
  }

  if (metalIds !== undefined) {
    updateData.metals = metalIds;
  }

  if (stoneTypeId !== undefined) {
    updateData.stoneType = stoneTypeId;
  }

  if (careInstruction !== undefined) {
    updateData.careInstruction = careInstruction;
  }

  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => file.path);
  }

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate(['category', 'metals', 'stoneType']);
  if (!product) throw new Error('Product not found');

  res.json({ success: true, message: 'Product updated successfully', data: product });
}));

router.delete('/:id', validate(productIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  res.json({ success: true, message: 'Product deleted successfully' });
}));

module.exports = router;
