const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const metalRoutes = require('./routes/metal');
const mediaAssetRoutes = require('./routes/mediaAsset');
const stoneRoutes = require('./routes/stone');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const socialHandleRoutes = require('./routes/socialHandle');
const contactRoutes = require('./routes/contact');
const reviewRoutes = require('./routes/review');
const favoriteRoutes = require('./routes/favorite');
const collectionRoutes = require('./routes/collection');
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
app.use('/api/media-assets', mediaAssetRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/social-handles', socialHandleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/collections', collectionRoutes);

app.use(errorHandler);

module.exports = app;
