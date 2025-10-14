const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression');
const ENV = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

if (ENV.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/', (req, res) => {
  res.status(200).json({
    status: true,
    data: {
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
    },
  });
});

app.use(errorHandler);

module.exports = app;
