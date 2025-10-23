const express = require('express');

const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate } = require('../middleware/auth');
const { addToCartSchema, updateCartSchema, cartIdSchema } = require('../validations/cart');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const carts = await Cart.find({ user: userId }).populate(['product', 'metal', 'stoneType']);
  const cartsWithPrice = carts.map(cart => {
    const productPrice = cart.product.price;
    const metalMultiplier = cart.purityLevel.priceMultiplier;
    const stonePrice = cart.stoneType ? cart.stoneType.price : 0;
    const totalPrice = (productPrice * metalMultiplier + stonePrice) * cart.quantity;
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

router.post('/', authenticate, validate(addToCartSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, metalId, purityLevel, stoneTypeId, quantity = 1 } = req.body;

  const cart = new Cart({
    user: userId,
    product: productId,
    metal: metalId,
    purityLevel,
    stoneType: stoneTypeId,
    quantity
  });

  await cart.save();
  await cart.populate(['product', 'metal', 'stoneType']);

  const productPrice = cart.product.price;
  const metalMultiplier = cart.purityLevel.priceMultiplier;
  const stonePrice = cart.stoneType ? cart.stoneType.price : 0;
  const totalPrice = (productPrice * metalMultiplier + stonePrice) * cart.quantity;

  res.status(201).json({ success: true, message: 'Item added to cart successfully', data: { ...cart.toObject(), calculatedPrice: totalPrice } });
}));

router.put('/:id', authenticate, validate(cartIdSchema, 'params'), validate(updateCartSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  const cart = await Cart.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true }).populate(['product', 'metal', 'stoneType']);
  if (!cart) throw new Error('Cart item not found');

  const productPrice = cart.product.price;
  const metalMultiplier = cart.purityLevel.priceMultiplier;
  const stonePrice = cart.stoneType ? cart.stoneType.price : 0;
  const totalPrice = (productPrice * metalMultiplier + stonePrice) * cart.quantity;

  res.json({ success: true, message: 'Cart item updated successfully', data: { ...cart.toObject(), calculatedPrice: totalPrice } });
}));

router.delete('/:id', authenticate, validate(cartIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const cart = await Cart.findOneAndDelete({ _id: id, user: userId });
  if (!cart) throw new Error('Cart item not found');
  res.json({ success: true, message: 'Cart item removed successfully' });
}));

module.exports = router;
