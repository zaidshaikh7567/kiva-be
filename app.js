const express = require('express');

const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const metalRoutes = require('./routes/metal');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/metals', metalRoutes);

app.use(errorHandler);

module.exports = app;
