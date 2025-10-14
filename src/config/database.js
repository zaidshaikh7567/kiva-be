const mongoose = require('mongoose');
const ENV = require('./env');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
