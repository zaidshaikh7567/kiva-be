const express = require('express');

const categoryRoutes = require('./routes/category');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

module.exports = app;
