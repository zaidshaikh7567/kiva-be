const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Get all products with pagination and optional category filter
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProductById);

// POST /api/products - Create new product with image upload
router.post('/', productController.uploadImages, productController.createProduct);

// PUT /api/products/:id - Update product with optional image upload
router.put('/:id', productController.uploadImages, productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
