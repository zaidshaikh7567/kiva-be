const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const metalRoutes = require('./routes/metal');
const stoneRoutes = require('./routes/stone');
const cartRoutes = require('./routes/cart');
const errorHandler = require('./middleware/errorHandler');
const { CORS_ORIGIN } = require('./config/env');

const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

module.exports = app;
