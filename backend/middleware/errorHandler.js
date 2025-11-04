const { ZodError } = require('zod');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof ZodError) {
    const firstError = err.issues[0];
    return res.status(400).json({
      success: false,
      message: firstError?.message || 'Validation failed',
    });
  }

  res.status(500).json({ success: false, message: err?.message || 'Something went wrong!' });
};

module.exports = errorHandler;
