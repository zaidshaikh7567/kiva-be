require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  MONGO_URI: process.env.MONGO_URI,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

for (const key in ENV) {
  if (ENV[key] === undefined) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
}

module.exports = ENV;
