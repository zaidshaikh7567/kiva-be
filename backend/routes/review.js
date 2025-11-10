const express = require('express');
const multer = require('multer');

const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createReviewSchema, updateReviewSchema, reviewIdSchema } = require('../validations/review');
const validate = require('../middleware/validate');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff', 'ico'];
const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v', '3gp', 'ogv', 'mpeg', 'mpg'];

const memoryStorage = multer.memoryStorage();

const MAX_MEDIA_ITEMS = 10;

const uploadReviewMedia = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max per file
    files: MAX_MEDIA_ITEMS,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (imageExtensions.includes(fileExtension) || videoExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed image formats: ${imageExtensions.join(', ')}. Allowed video formats: ${videoExtensions.join(', ')}`));
    }
  },
}).array('media', MAX_MEDIA_ITEMS);

const processReviewMedia = asyncHandler(async (req, res, next) => {
  if (typeof req.body.rating === 'string') {
    const parsedRating = Number(req.body.rating);
    if (!Number.isNaN(parsedRating)) {
      req.body.rating = parsedRating;
    }
  }

  const parseMediaPayload = (value) => {
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && (item.url || item.publicId) && item.type && (item.type === 'image' || item.type === 'video')
          );
        }
        if (parsed && parsed.url && parsed.type) {
          return [parsed];
        }
        return [];
      } catch {
        return [];
      }
    }
    if (Array.isArray(value)) {
      return value.filter(
        (item) => item && (item.url || item.publicId) && item.type && (item.type === 'image' || item.type === 'video')
      );
    }
    if (value && value.url && value.type) {
      return [value];
    }
    return [];
  };

  const uploadedMedia = [];
  if (Array.isArray(req.files) && req.files.length) {
    for (const file of req.files) {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      const isImage = imageExtensions.includes(fileExtension);
      const isVideo = videoExtensions.includes(fileExtension);
      const resourceType = isVideo ? 'video' : 'image';

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'reviews/media',
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      uploadedMedia.push({
        type: resourceType,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }
  }

  const existingMedia = parseMediaPayload(req.body.existingMedia || req.body.media);

  if (req.body.removeMedia === 'true' || req.body.removeMedia === true) {
    req.body.media = [];
  } else {
    const combined = [...existingMedia, ...uploadedMedia];
    req.body.media = combined.slice(0, MAX_MEDIA_ITEMS);
  }

  delete req.body.existingMedia;
  delete req.body.removeMedia;

  next();
});

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Review.countDocuments();
  const reviews = await Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.post('/', uploadReviewMedia, processReviewMedia, validate(createReviewSchema), asyncHandler(async (req, res) => {
  const { name, email, comment, rating } = req.body;
  const media = Array.isArray(req.body.media) ? req.body.media : [];

  const review = new Review({
    name,
    email,
    comment,
    rating,
    media,
  });

  await review.save();

  res.status(201).json({ success: true, message: 'Review created successfully', data: review });
}));

router.get('/:id', validate(reviewIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found');
  res.json({ success: true, message: 'Review retrieved successfully', data: review });
}));

router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  uploadReviewMedia,
  processReviewMedia,
  validate(reviewIdSchema, 'params'),
  validate(updateReviewSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    if (Object.prototype.hasOwnProperty.call(updateData, 'name')) {
      review.name = updateData.name;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'email')) {
      review.email = updateData.email;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'comment')) {
      review.comment = updateData.comment;
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'rating')) {
      review.rating = updateData.rating;
    }

    let mediaToDelete = [];

    if (Object.prototype.hasOwnProperty.call(updateData, 'media')) {
      const previousMedia = Array.isArray(review.media) ? review.media : [];
      const nextMedia = Array.isArray(updateData.media) ? updateData.media : [];

      const nextPublicIds = new Set(
        nextMedia
          .map((item) => item?.publicId)
          .filter(Boolean)
      );

      mediaToDelete = previousMedia.filter(
        (item) => item?.publicId && !nextPublicIds.has(item.publicId)
      );

      review.media = nextMedia;
      review.markModified('media');
    }

    await review.save();

    if (mediaToDelete.length) {
      await Promise.all(
        mediaToDelete.map(async (item) => {
          try {
            await cloudinary.uploader.destroy(item.publicId, {
              resource_type: item.type === 'video' ? 'video' : 'image',
            });
          } catch (error) {
            console.error('Failed to delete replaced review media from Cloudinary:', error);
          }
        })
      );
    }

    res.json({ success: true, message: 'Review updated successfully', data: review });
  })
);

router.delete('/:id', authenticate, authorize('super_admin'), validate(reviewIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new Error('Review not found');

  if (Array.isArray(review.media) && review.media.length) {
    await Promise.all(
      review.media
        .filter((item) => item?.publicId)
        .map(async (item) => {
          try {
            await cloudinary.uploader.destroy(item.publicId, {
              resource_type: item.type === 'video' ? 'video' : 'image',
            });
          } catch (error) {
            console.error('Failed to delete review media from Cloudinary:', error);
          }
        })
    );
  }

  res.json({ success: true, message: 'Review deleted successfully' });
}));

module.exports = router;

