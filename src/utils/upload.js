const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const ENV = require('../config/env');

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
});

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'kiva-uploads',
        allowed_formats: options.allowedFormats || ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: options.transformation || [{ width: 1000, height: 1000, crop: 'limit' }],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadToCloudinary,
  cloudinary,
};
