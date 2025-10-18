const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('../config/cloudinary');

const createMulter = ({ storage = 'local', allowedFormats = ['jpg', 'png', 'jpeg'], maxSize = 5 * 1024 * 1024, folder = 'uploads' }) => {
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

  return multer({
    storage: uploadStorage,
    fileFilter: (req, file, cb) => {
      if (allowedFormats.includes(file.originalname.split('.').pop().toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error('File type not allowed'));
      }
    },
    limits: { fileSize: maxSize },
  });
};

module.exports = createMulter;
