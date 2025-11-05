const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('../config/cloudinary');

const createMulter = ({ storage = 'local', allowedFormats = ['jpg', 'png', 'jpeg', 'webp'], maxSize = 5 * 1024 * 1024, folder = 'uploads' }) => {
  let uploadStorage;

  if (storage === 'cloudinary') {
    uploadStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder,
        allowedFormats,
      },
    });
  } else if (storage === 'local') {
    uploadStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, folder);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });
  } else {
    throw new Error('Invalid storage option');
  }

  // Map file extensions to mimetypes for validation
  const mimeTypeMap = {
    // Images
    'jpg': ['image/jpeg', 'image/jpg'],
    'jpeg': ['image/jpeg', 'image/jpg'],
    'png': ['image/png'],
    'webp': ['image/webp'],
    // Videos
    'mp4': ['video/mp4'],
    'mov': ['video/quicktime'],
    'avi': ['video/x-msvideo'],
    'webm': ['video/webm'],
    'mkv': ['video/x-matroska'],
  };

  return multer({
    storage: uploadStorage,
    fileFilter: (req, file, cb) => {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      const fileMimeType = file.mimetype.toLowerCase();
      
      // Check extension first
      const isValidExtension = allowedFormats.includes(fileExtension);
      
      if (!isValidExtension) {
        return cb(new Error(`File type not allowed. Allowed formats: ${allowedFormats.join(', ')}`));
      }
      
      // Optionally validate mimetype if we have a mapping for it
      const expectedMimeTypes = mimeTypeMap[fileExtension];
      if (expectedMimeTypes && !expectedMimeTypes.includes(fileMimeType)) {
        // Warn but allow if extension is valid (some clients send different mimetypes)
        // This is a soft validation - extension is the primary check
      }
      
      cb(null, true);
    },
    limits: { fileSize: maxSize },
  });
};

module.exports = createMulter;
