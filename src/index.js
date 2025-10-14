const app = require('./app');
const ENV = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/database');

const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connected successfully');

    app.listen(ENV.PORT, () => {
      logger.info(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error('Server startup failed', error);
    process.exit(1);
  }
};

startServer();
