const express = require('express');

const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate } = require('../middleware/auth');
const { addFavoriteSchema, favoriteIdSchema, productIdSchema } = require('../validations/favorite');
const validate = require('../middleware/validate');

const router = express.Router();

// Get all favorites for the authenticated user
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Favorite.countDocuments({ user: userId });
  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: 'product',
      populate: [
        { path: 'category' },
        { path: 'metals' },
        { path: 'stoneType' }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Favorites retrieved successfully',
    data: favorites,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

// Add a product to favorites
router.post('/', authenticate, validate(addFavoriteSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
  if (existingFavorite) {
    return res.json({ 
      success: true, 
      message: 'Product is already in favorites', 
      data: existingFavorite 
    });
  }

  const favorite = new Favorite({
    user: userId,
    product: productId
  });

  await favorite.save();
  await favorite.populate({
    path: 'product',
    populate: [
      { path: 'category' },
      { path: 'metals' },
      { path: 'stoneType' }
    ]
  });

  res.status(201).json({ 
    success: true, 
    message: 'Product added to favorites successfully', 
    data: favorite 
  });
}));

// Check if a product is in favorites
router.get('/check/:productId', authenticate, validate(productIdSchema, 'params'), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const favorite = await Favorite.findOne({ user: userId, product: productId });
  
  res.json({
    success: true,
    message: favorite ? 'Product is in favorites' : 'Product is not in favorites',
    data: {
      isFavorite: !!favorite,
      favorite: favorite || null
    }
  });
}));

// Remove a product from favorites by product ID (must come before /:id)
router.delete('/product/:productId', authenticate, validate(productIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
  if (!favorite) {
    throw new Error('Product is not in favorites');
  }

  res.json({ success: true, message: 'Product removed from favorites successfully' });
}));

// Remove a product from favorites by favorite ID
router.delete('/:id', authenticate, validate(favoriteIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const favorite = await Favorite.findOneAndDelete({ _id: id, user: userId });
  if (!favorite) {
    throw new Error('Favorite not found');
  }

  res.json({ success: true, message: 'Product removed from favorites successfully' });
}));

module.exports = router;

