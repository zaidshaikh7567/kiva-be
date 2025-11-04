const express = require('express');

const Collection = require('../models/Collection');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createCollectionSchema, updateCollectionSchema, collectionIdSchema } = require('../validations/collection');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');

const upload = createMulter({ storage: 'cloudinary', allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], maxSize: 2 * 1024 * 1024, folder: 'collections' });

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Collection.countDocuments();
  const collections = await Collection.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Collections retrieved successfully',
    data: collections,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.post('/', authenticate, authorize('super_admin'), upload.array('images', 10), validate(createCollectionSchema), asyncHandler(async (req, res) => {
  const { title, category, video, isNew, isActive } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  const collection = new Collection({
    title,
    images,
    video,
    category,
    isNew: isNew !== undefined ? isNew : false,
    isActive: isActive !== undefined ? isActive : true
  });

  await collection.save();

  res.status(201).json({ success: true, message: 'Collection created successfully', data: collection });
}));

router.get('/:id', validate(collectionIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findById(id);
  if (!collection) throw new Error('Collection not found');
  res.json({ success: true, message: 'Collection retrieved successfully', data: collection });
}));

router.put('/:id', authenticate, authorize('super_admin'), upload.array('images', 10), validate(collectionIdSchema, 'params'), validate(updateCollectionSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, video, isNew, isActive } = req.body;

  // Get existing collection to preserve existing images
  const existingCollection = await Collection.findById(id);
  if (!existingCollection) throw new Error('Collection not found');

  let updateData = {};
  if (title !== undefined) updateData.title = title;
  if (category !== undefined) updateData.category = category;
  if (video !== undefined) updateData.video = video;
  if (isNew !== undefined) updateData.isNew = isNew;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Merge new images with existing images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => file.path);
    const existingImages = existingCollection.images || [];
    updateData.images = [...existingImages, ...newImages];
  }

  const collection = await Collection.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!collection) throw new Error('Collection not found');

  res.json({ success: true, message: 'Collection updated successfully', data: collection });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(collectionIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) throw new Error('Collection not found');
  res.json({ success: true, message: 'Collection deleted successfully' });
}));

module.exports = router;
