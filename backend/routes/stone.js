const express = require('express');

const Stone = require('../models/Stone');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createStoneSchema, updateStoneSchema, stoneIdSchema } = require('../validations/stone');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Stone.countDocuments();
  const stones = await Stone.find().populate('category').skip(skip).limit(limit);
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Stones retrieved successfully',
    data: stones,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.post('/', authenticate, authorize('super_admin'), validate(createStoneSchema), asyncHandler(async (req, res) => {
  const { name, price, shape, categoryId, active } = req.body;

  const stone = new Stone({
    name,
    price,
    shape,
    category: categoryId,
    active
  });

  await stone.save();
  await stone.populate('category');

  res.status(201).json({ success: true, message: 'Stone created successfully', data: stone });
}));

router.get('/:id', validate(stoneIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stone = await Stone.findById(id).populate('category');
  if (!stone) throw new Error('Stone not found');
  res.json({ success: true, message: 'Stone retrieved successfully', data: stone });
}));

router.put('/:id', authenticate, authorize('super_admin'), validate(stoneIdSchema, 'params'), validate(updateStoneSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryId, ...updateData } = req.body;

  if (categoryId !== undefined) {
    updateData.category = categoryId;
  }

  const stone = await Stone.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
  if (!stone) throw new Error('Stone not found');

  res.json({ success: true, message: 'Stone updated successfully', data: stone });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(stoneIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stone = await Stone.findByIdAndDelete(id);
  if (!stone) throw new Error('Stone not found');
  res.json({ success: true, message: 'Stone deleted successfully' });
}));

module.exports = router;
