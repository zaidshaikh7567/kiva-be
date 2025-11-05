const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const Collection = require('../models/Collection');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createCollectionSchema, updateCollectionSchema, collectionIdSchema } = require('../validations/collection');
const validate = require('../middleware/validate');

// Memory storage for handling files before uploading to Cloudinary
const memoryStorage = multer.memoryStorage();

// Multer configuration for handling both images and video
const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for video
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    // Check if it's an image
    const imageFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const videoFormats = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    
    if (imageFormats.includes(fileExtension) || videoFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed formats: ${imageFormats.join(', ')}, ${videoFormats.join(', ')}`));
    }
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]);

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

// Custom middleware to process images and video separately
const processUploads = async (req, res, next) => {
  try {
    const images = [];
    let videoUrl = req.body.video; // Default to URL if provided
    
    // Process image files
    if (req.files?.images && Array.isArray(req.files.images)) {
      for (const file of req.files.images) {
        try {
          // Upload image to Cloudinary using buffer
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'collections',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });
          images.push(uploadResult.secure_url);
        } catch (err) {
          console.error('Error uploading image:', err);
          throw new Error('Failed to upload image: ' + err.message);
        }
      }
    }
    
    // Process video file
    if (req.files?.video && req.files.video[0]) {
      const videoFile = req.files.video[0];
      
      try {
        // Upload video to Cloudinary using buffer
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'collections/videos',
              resource_type: 'video',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(videoFile.buffer);
        });
        videoUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Error uploading video:', err);
        throw new Error('Failed to upload video: ' + err.message);
      }
    }
    
    // Attach processed data to request
    req.processedImages = images;
    req.processedVideoUrl = videoUrl;
    
    // Validate that video is provided (either URL or file)
    if (!videoUrl && !req.files?.video) {
      return res.status(400).json({
        success: false,
        message: 'Video is required (either as URL or file upload)'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

router.post('/', authenticate, authorize('super_admin'), 
  upload,
  validate(createCollectionSchema), 
  processUploads,
  asyncHandler(async (req, res) => {
    const { title, category, isNew, isActive } = req.body;
    const images = req.processedImages || [];
    const video = req.processedVideoUrl || req.body.video;

    if (!video) {
      return res.status(400).json({
        success: false,
        message: 'Video is required (either as URL or file upload)'
      });
    }

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
  })
);

router.get('/:id', validate(collectionIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findById(id);
  if (!collection) throw new Error('Collection not found');
  res.json({ success: true, message: 'Collection retrieved successfully', data: collection });
}));

router.put('/:id', authenticate, authorize('super_admin'), 
  upload,
  validate(collectionIdSchema, 'params'), 
  validate(updateCollectionSchema), 
  processUploads,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, category, isNew, isActive } = req.body;

    // Get existing collection to preserve existing images
    const existingCollection = await Collection.findById(id);
    if (!existingCollection) throw new Error('Collection not found');

    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (isNew !== undefined) updateData.isNew = isNew;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle video update (either new file or URL)
    if (req.processedVideoUrl) {
      updateData.video = req.processedVideoUrl;
    } else if (req.body.video !== undefined) {
      updateData.video = req.body.video;
    }

    // Merge new images with existing images
    if (req.processedImages && req.processedImages.length > 0) {
      const existingImages = existingCollection.images || [];
      updateData.images = [...existingImages, ...req.processedImages];
    }

    const collection = await Collection.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!collection) throw new Error('Collection not found');

    res.json({ success: true, message: 'Collection updated successfully', data: collection });
  })
);

router.delete('/:id', authenticate, authorize('super_admin'), validate(collectionIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) throw new Error('Collection not found');
  res.json({ success: true, message: 'Collection deleted successfully' });
}));

module.exports = router;
