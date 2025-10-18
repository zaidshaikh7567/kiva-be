const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

connectDB().then(() => {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT} in ${NODE_ENV || 'development'} mode`));
});
