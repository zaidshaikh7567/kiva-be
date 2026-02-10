const express = require('express');

const MediaAsset = require('../models/MediaAsset');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createMediaAssetSchema,
  updateMediaAssetSchema,
  mediaAssetIdSchema,
} = require('../validations/mediaAsset');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');

const upload = createMulter({
  storage: 'cloudinary',
  // Allow both images and common video formats
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'avi', 'webm', 'mkv','avif'],
  maxSize: 20 * 1024 * 1024,
  folder: 'media-assets',
});

const router = express.Router();

// GET /api/media-assets
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, section, type, isActive } = req.query;

    const filter = {};
    
    // Only add page filter if it's a valid enum value (not a number)
    if (page && ['home', 'contact', 'about', 'favorites', 'custom','ring', 'bracelet', 'earring', 'necklace', 'other'].includes(page)) {
      filter.page = page;
    }
    
    if (section) filter.section = section;
    if (type) filter.type = type;
    
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      const active =
        typeof isActive === 'string'
          ? ['true', '1', 'yes', 'on'].includes(isActive.toLowerCase())
          : Boolean(isActive);
      filter.isActive = active;
    }

    const assets = await MediaAsset.find(filter).sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      message: 'Media assets retrieved successfully',
      data: assets,
    });
  })
);

// POST /api/media-assets
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  upload.single('file'),
  validate(createMediaAssetSchema),
  asyncHandler(async (req, res) => {
    if (!req.file || !req.file.path) {
      throw new Error('File is required');
    }

    const body = req.body || {};

    const asset = await MediaAsset.create({
      title: body.title || '',
      description: body.description || '',
      type: body.type,
      url: req.file.path,
      publicId: req.file.filename || req.file.public_id,
      page: body.page || 'other',
      section: body.section || '',
      key: body.key || '',
      isActive:
        body.isActive === undefined
          ? true
          : ['true', '1', 'yes', 'on'].includes(String(body.isActive).toLowerCase()),
      sortOrder:
        body.sortOrder === undefined || body.sortOrder === ''
          ? 0
          : Number(body.sortOrder),
    });

    res.status(201).json({
      success: true,
      message: 'Media asset created successfully',
      data: asset,
    });
  })
);

// PUT /api/media-assets/:id
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  upload.single('file'),
  validate(mediaAssetIdSchema, 'params'),
  validate(updateMediaAssetSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};

    const update = {
      ...body,
    };

    if (body.isActive !== undefined) {
      update.isActive = ['true', '1', 'yes', 'on'].includes(
        String(body.isActive).toLowerCase()
      );
    }

    if (body.sortOrder !== undefined && body.sortOrder !== '') {
      update.sortOrder = Number(body.sortOrder);
    }

    if (req.file && req.file.path) {
      update.url = req.file.path;
      update.publicId = req.file.filename || req.file.public_id;
    }

    const asset = await MediaAsset.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!asset) {
      throw new Error('Media asset not found');
    }

    res.json({
      success: true,
      message: 'Media asset updated successfully',
      data: asset,
    });
  })
);

// DELETE /api/media-assets/:id
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  validate(mediaAssetIdSchema, 'params'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const asset = await MediaAsset.findByIdAndDelete(id);

    if (!asset) {
      throw new Error('Media asset not found');
    }

    res.json({
      success: true,
      message: 'Media asset deleted successfully',
    });
  })
);

module.exports = router;


