const express = require('express');

const SocialHandle = require('../models/SocialHandle');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createSocialHandleSchema, updateSocialHandleSchema, socialHandleIdSchema } = require('../validations/socialHandle');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');

const upload = createMulter({ storage: 'cloudinary', allowedFormats: ['jpg', 'png', 'jpeg'], maxSize: 2 * 1024 * 1024, folder: 'social-handles' });

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await SocialHandle.countDocuments();
  const socialHandles = await SocialHandle.find().skip(skip).limit(limit);
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Social handles retrieved successfully',
    data: socialHandles,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.post('/', authenticate, authorize('super_admin'), upload.single('image'), validate(createSocialHandleSchema), asyncHandler(async (req, res) => {
  const { platform, url, isActive } = req.body;
  const image = req.file ? req.file.path : null;

  if (!image) {
    throw new Error('Image is required');
  }

  const socialHandle = new SocialHandle({
    platform,
    url,
    image,
    isActive: isActive !== undefined ? isActive : true
  });

  await socialHandle.save();

  res.status(201).json({ success: true, message: 'Social handle created successfully', data: socialHandle });
}));

router.get('/:id', validate(socialHandleIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const socialHandle = await SocialHandle.findById(id);
  if (!socialHandle) throw new Error('Social handle not found');
  res.json({ success: true, message: 'Social handle retrieved successfully', data: socialHandle });
}));

router.put('/:id', authenticate, authorize('super_admin'), upload.single('image'), validate(socialHandleIdSchema, 'params'), validate(updateSocialHandleSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { platform, url, isActive } = req.body;

  let updateData = {};
  if (platform !== undefined) updateData.platform = platform;
  if (url !== undefined) updateData.url = url;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (req.file) updateData.image = req.file.path;

  const socialHandle = await SocialHandle.findByIdAndUpdate(id, updateData, { new: true });
  if (!socialHandle) throw new Error('Social handle not found');

  res.json({ success: true, message: 'Social handle updated successfully', data: socialHandle });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(socialHandleIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const socialHandle = await SocialHandle.findByIdAndDelete(id);
  if (!socialHandle) throw new Error('Social handle not found');
  res.json({ success: true, message: 'Social handle deleted successfully' });
}));

module.exports = router;

