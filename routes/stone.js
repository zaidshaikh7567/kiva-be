const express = require('express');

const Stone = require('../models/Stone');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { createStoneSchema, updateStoneSchema, stoneIdSchema } = require('../validations/stone');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const stones = await Stone.find();
  res.json({ success: true, message: 'Stones retrieved successfully', data: stones });
}));

router.post('/', validate(createStoneSchema), asyncHandler(async (req, res) => {
  const { name, price, shape, active } = req.body;

  const stone = new Stone({
    name,
    price,
    shape,
    active
  });

  await stone.save();

  res.status(201).json({ success: true, message: 'Stone created successfully', data: stone });
}));

router.get('/:id', validate(stoneIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stone = await Stone.findById(id);
  if (!stone) throw new Error('Stone not found');
  res.json({ success: true, message: 'Stone retrieved successfully', data: stone });
}));

router.put('/:id', validate(stoneIdSchema, 'params'), validate(updateStoneSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const stone = await Stone.findByIdAndUpdate(id, updateData, { new: true });
  if (!stone) throw new Error('Stone not found');

  res.json({ success: true, message: 'Stone updated successfully', data: stone });
}));

router.delete('/:id', validate(stoneIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stone = await Stone.findByIdAndDelete(id);
  if (!stone) throw new Error('Stone not found');
  res.json({ success: true, message: 'Stone deleted successfully' });
}));

module.exports = router;
