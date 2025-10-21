const express = require('express');
const cors = require('cors');

const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const metalRoutes = require('./routes/metal');
const stoneRoutes = require('./routes/stone');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/env');

const app = express();

app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/stones', stoneRoutes);

app.use(errorHandler);

module.exports = app;
