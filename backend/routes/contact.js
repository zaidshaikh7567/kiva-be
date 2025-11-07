const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createContactSchema, contactIdSchema } = require('../validations/contact');
const validate = require('../middleware/validate');

// Memory storage for handling files before uploading to Cloudinary
const memoryStorage = multer.memoryStorage();

// Multer configuration for handling both images and videos
// Allow all common image and video formats
const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for videos
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    // All common image formats
    const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff', 'ico', 'heic', 'heif'];
    // All common video formats
    const videoFormats = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v', '3gp', 'ogv', 'mpeg', 'mpg'];
    
    if (imageFormats.includes(fileExtension) || videoFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed formats: Images (${imageFormats.join(', ')}) and Videos (${videoFormats.join(', ')})`));
    }
  }
}).fields([
  { name: 'media', maxCount: 20 } // Allow up to 20 files (images and videos combined)
]);

const router = express.Router();

// Helper function to detect media type from URL
const detectMediaTypeFromUrl = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg', '.tiff', '.ico', '.heic', '.heif'];
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', '.mpg'];
  
  const urlLower = url.toLowerCase();
  
  // Check for image extensions
  if (imageExtensions.some(ext => urlLower.includes(ext))) {
    return 'image';
  }
  
  // Check for video extensions
  if (videoExtensions.some(ext => urlLower.includes(ext))) {
    return 'video';
  }
  
  // Check for common image domains/patterns
  if (urlLower.includes('image') || urlLower.includes('img') || urlLower.includes('photo') || urlLower.includes('picture')) {
    return 'image';
  }
  
  // Check for common video domains/patterns
  if (urlLower.includes('video') || urlLower.includes('youtube') || urlLower.includes('vimeo') || urlLower.includes('stream')) {
    return 'video';
  }
  
  // Default to image if uncertain
  return 'image';
};

// Middleware to process media uploads (both files and URLs)
const processMediaUploads = asyncHandler(async (req, res, next) => {
  const mediaArray = [];
  
  // Process uploaded files (binary)
  if (req.files?.media && Array.isArray(req.files.media)) {
    for (const file of req.files.media) {
      try {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff', 'ico', 'heic', 'heif'];
        const videoFormats = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v', '3gp', 'ogv', 'mpeg', 'mpg'];
        
        const isImage = imageFormats.includes(fileExtension);
        const isVideo = videoFormats.includes(fileExtension);
        
        if (!isImage && !isVideo) {
          continue; // Skip invalid files
        }
        
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'contacts/media',
              resource_type: isImage ? 'image' : 'video',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        mediaArray.push({
          type: isImage ? 'image' : 'video',
          url: uploadResult.secure_url
        });
      } catch (err) {
        console.error('Error uploading media file:', err);
        // Continue processing other files even if one fails
      }
    }
  }
  
  // Process URL strings from request body
  // Handle both JSON string (from FormData) and array (from JSON)
  let mediaUrlsArray = req.body.mediaUrls;
  
  // If it's a JSON string (from FormData), parse it
  if (typeof mediaUrlsArray === 'string') {
    try {
      mediaUrlsArray = JSON.parse(mediaUrlsArray);
    } catch (err) {
      console.error('Error parsing mediaUrls JSON:', err);
      mediaUrlsArray = null;
    }
  }
  
  if (mediaUrlsArray && Array.isArray(mediaUrlsArray)) {
    for (const mediaItem of mediaUrlsArray) {
      try {
        // If it's already an object with type and url
        if (mediaItem.type && mediaItem.url) {
          mediaArray.push({
            type: mediaItem.type,
            url: mediaItem.url
          });
        } 
        // If it's just a URL string, detect the type
        else if (typeof mediaItem === 'string') {
          const detectedType = detectMediaTypeFromUrl(mediaItem);
          mediaArray.push({
            type: detectedType,
            url: mediaItem
          });
        }
      } catch (err) {
        console.error('Error processing media URL:', err);
        // Continue processing other URLs even if one fails
      }
    }
  }
  
  // Attach processed media to request
  req.processedMedia = mediaArray;
  next();
});

// Public route - anyone can submit contact form
// Note: Validation happens after file processing to allow both files and URLs
router.post('/', upload, processMediaUploads, validate(createContactSchema), asyncHandler(async (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    message, 
    service,
    designDescription,
    preferredMetal,
    preferredStone,
    budget,
    timeline,
    size
  } = req.body;

  const contact = new Contact({
    name,
    email,
    phone: phone || undefined,
    message,
    service: service || 'general',
    designDescription: designDescription || undefined,
    preferredMetal: preferredMetal || undefined,
    preferredStone: preferredStone || undefined,
    budget: budget || undefined,
    timeline: timeline || undefined,
    size: size || undefined,
    media: req.processedMedia || []
  });

  await contact.save();

  res.status(201).json({ success: true, message: 'Contact form submitted successfully', data: contact });
}));

// Admin routes - require authentication
router.get('/', authenticate, authorize('super_admin'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Contact.countDocuments();
  const contacts = await Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Contacts retrieved successfully',
    data: contacts,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.get('/:id', authenticate, authorize('super_admin'), validate(contactIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) throw new Error('Contact not found');
  res.json({ success: true, message: 'Contact retrieved successfully', data: contact });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(contactIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new Error('Contact not found');
  res.json({ success: true, message: 'Contact deleted successfully' });
}));

module.exports = router;

