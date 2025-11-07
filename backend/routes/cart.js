const express = require('express');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Metal = require('../models/Metal');
const Stone = require('../models/Stone');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate } = require('../middleware/auth');
const { addToCartSchema, updateCartSchema, cartIdSchema } = require('../validations/cart');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const carts = await Cart.find({ user: userId }).populate(['product', 'metal', 'stoneType']);
  const cartsWithPrice = carts.map(cart => {
    // Check if product exists and has price
    if (!cart.product) {
      throw new Error(`Product not found for cart item ${cart._id}`);
    }
    
    const productPrice = cart.product.price || 0;
    const metalMultiplier = cart.purityLevel?.priceMultiplier || 1;
    const stonePrice = cart.stoneType?.price || 0;
    const totalPrice = ((productPrice * metalMultiplier) + stonePrice) * (cart.quantity || 1);
    // const totalPrice = (productPrice * metalMultiplier + stonePrice) * (cart.quantity || 1);
    return {
      ...cart.toObject(),
      calculatedPrice: totalPrice
    };
  });
  res.json({
    success: true,
    message: 'Cart retrieved successfully',
    data: cartsWithPrice
  });
}));

router.get('/:id', authenticate, validate(cartIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOne({ _id: id, user: userId }).populate(['product', 'metal', 'stoneType']);

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  if (!cart.product) {
    throw new Error('Product not found for this cart item');
  }

  const productPrice = cart.product?.price || 0;
  const metalMultiplier = cart.purityLevel?.priceMultiplier || 1;
  const stonePrice = cart.stoneType?.price || 0;
  const totalPrice = ((productPrice * metalMultiplier) + stonePrice) * (cart.quantity || 1);

  res.json({
    success: true,
    message: 'Cart item retrieved successfully',
    data: { ...cart.toObject(), calculatedPrice: totalPrice }
  });
}));

router.post('/', authenticate, validate(addToCartSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, metalId, purityLevel, stoneTypeId, ringSize, quantity = 1 } = req.body;

  // Check if product already exists in cart 05-11-2025
  const existingCartItem = await Cart.findOne({
    user: userId,
    product: productId
  });

  if (existingCartItem) {
    return res.status(400).json({
      success: false,
      message: 'This product is already in your cart'
    });
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Verify metal exists
  const metal = await Metal.findById(metalId);
  if (!metal) {
    throw new Error('Metal not found');
  }

  // Verify stone exists if provided
  if (stoneTypeId) {
    const stone = await Stone.findById(stoneTypeId);
    if (!stone) {
      throw new Error('Stone not found');
    }
  }

  const cart = new Cart({
    user: userId,
    product: productId,
    metal: metalId,
    purityLevel,
    stoneType: stoneTypeId,
    ringSize: ringSize || undefined,
    quantity
  });

  await cart.save();
  await cart.populate(['product', 'metal', 'stoneType']);

  // Calculate price with null checks
  const productPrice = cart.product?.price || 0;
  const metalMultiplier = cart.purityLevel?.priceMultiplier || 1;
  const stonePrice = cart.stoneType?.price || 0;
  const totalPrice = ((productPrice * metalMultiplier) + stonePrice) * (cart.quantity || 1);
  // const totalPrice = (productPrice * metalMultiplier + stonePrice) * (cart.quantity || 1);
  res.status(201).json({ success: true, message: 'Item added to cart successfully', data: { ...cart.toObject(), calculatedPrice: totalPrice } });
}));

router.put('/:id', authenticate, validate(cartIdSchema, 'params'), validate(updateCartSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { stoneTypeId, metalId, ...updateData } = req.body;

  // Verify metal exists if provided
  if (metalId) {
    const metal = await Metal.findById(metalId);
    if (!metal) {
      throw new Error('Metal not found');
    }
    updateData.metal = metalId;
  }

  // Verify stone exists if provided and map stoneTypeId to stoneType
  if (stoneTypeId !== undefined) {
    if (stoneTypeId) {
      // If stoneTypeId is provided (not null/undefined), verify it exists
      const stone = await Stone.findById(stoneTypeId);
      if (!stone) {
        throw new Error('Stone not found');
      }
      updateData.stoneType = stoneTypeId;
    } else {
      // If stoneTypeId is null/empty, remove the stoneType
      updateData.stoneType = null;
    }
  }

  const cart = await Cart.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true }).populate(['product', 'metal', 'stoneType']);
  if (!cart) throw new Error('Cart item not found');

  // Check if product exists
  if (!cart.product) {
    throw new Error('Product not found for this cart item');
  }

  // Calculate price with null checks
  const productPrice = cart.product?.price || 0;
  const metalMultiplier = cart.purityLevel?.priceMultiplier || 1;
  const stonePrice = cart.stoneType?.price || 0;
  const totalPrice = ((productPrice * metalMultiplier) + stonePrice) * (cart.quantity || 1);
  // const totalPrice = (productPrice * metalMultiplier + stonePrice) * (cart.quantity || 1);
  res.json({ success: true, message: 'Cart item updated successfully', data: { ...cart.toObject(), calculatedPrice: totalPrice } });
}));

router.delete('/:id', authenticate, validate(cartIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const cart = await Cart.findOneAndDelete({ _id: id, user: userId });
  if (!cart) throw new Error('Cart item not found');
  res.json({ success: true, message: 'Cart item removed successfully' });
}));

router.delete('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await Cart.deleteMany({ user: userId });
  res.json({ 
    success: true, 
    message: 'Cart cleared successfully',
    data: { deletedCount: result.deletedCount }
  });
}));

module.exports = router;
