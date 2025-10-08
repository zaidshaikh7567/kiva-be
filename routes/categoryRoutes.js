const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get single category
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Create new category with optional image upload
router.post('/', categoryController.uploadCategoryImage, categoryController.createCategory);

// PUT /api/categories/:id - Update category with optional image upload
router.put('/:id', categoryController.uploadCategoryImage, categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
