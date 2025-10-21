const express = require('express');

const Metal = require('../models/Metal');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { createMetalSchema, updateMetalSchema, metalIdSchema } = require('../validations/metal');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const metals = await Metal.find();
  res.json({ success: true, message: 'Metals retrieved successfully', data: metals });
}));

router.post('/', validate(createMetalSchema), asyncHandler(async (req, res) => {
  const { name, color, purityLevels, active } = req.body;

  const metal = new Metal({
    name,
    color,
    purityLevels,
    active
  });

  await metal.save();

  res.status(201).json({ success: true, message: 'Metal created successfully', data: metal });
}));

router.get('/:id', validate(metalIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const metal = await Metal.findById(id);
  if (!metal) throw new Error('Metal not found');
  res.json({ success: true, message: 'Metal retrieved successfully', data: metal });
}));

router.put('/:id', validate(metalIdSchema, 'params'), validate(updateMetalSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const metal = await Metal.findByIdAndUpdate(id, updateData, { new: true });
  if (!metal) throw new Error('Metal not found');

  res.json({ success: true, message: 'Metal updated successfully', data: metal });
}));

router.delete('/:id', validate(metalIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const metal = await Metal.findByIdAndDelete(id);
  if (!metal) throw new Error('Metal not found');
  res.json({ success: true, message: 'Metal deleted successfully' });
}));

module.exports = router;
