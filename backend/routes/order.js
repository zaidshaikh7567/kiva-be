const express = require('express');

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Metal = require('../models/Metal');
const Stone = require('../models/Stone');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createOrderSchema,
  orderIdSchema,
  orderNumberSchema,
  updateOrderStatusSchema,
  orderQuerySchema
} = require('../validations/order');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', authenticate, validate(createOrderSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, billingAddress, phone, paymentMethod, notes } = req.body;

  const cartItems = await Cart.find({ user: userId }).populate(['product', 'metal', 'stoneType']);

  if (cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  const orderItems = [];
  let subtotal = 0;

  for (const cartItem of cartItems) {
    if (!cartItem.product) {
      throw new Error(`Product not found for cart item ${cartItem._id}`);
    }

    const productPrice = cartItem.product.price || 0;
    const metalMultiplier = cartItem.purityLevel?.priceMultiplier || 1;
    const stonePrice = cartItem.stoneType?.price || 0;
    const unitPrice = (productPrice * metalMultiplier) + stonePrice;
    const totalPrice = unitPrice * (cartItem.quantity || 1);

    orderItems.push({
      product: cartItem.product._id,
      productName: cartItem.product.title,
      productImage: cartItem.product.images?.[0] || '',
      metal: cartItem.metal._id,
      metalName: cartItem.metal.name,
      purityLevel: cartItem.purityLevel,
      stoneType: cartItem.stoneType?._id,
      stoneName: cartItem.stoneType?.name,
      stonePrice: stonePrice,
      ringSize: cartItem.ringSize,
      quantity: cartItem.quantity || 1,
      unitPrice: unitPrice,
      totalPrice: totalPrice
    });

    subtotal += totalPrice;
  }

  const order = new Order({
    user: userId,
    items: orderItems,
    subtotal: subtotal,
    total: subtotal,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    phone: phone,
    paymentMethod: paymentMethod,
    notes: notes
  });

  await order.save();
  await order.populate('user', 'name email');

  await Cart.deleteMany({ user: userId });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
}));

router.get('/my-orders', authenticate, validate(orderQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const query = { user: userId };
  if (status && status !== '') {
    query.status = status;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / limit);

  res.json({
    success: true,
    message: 'Orders retrieved successfully',
    data: {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}));

router.get('/:id', authenticate, validate(orderIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const query = userRole === 'super_admin' ? { _id: id } : { _id: id, user: userId };

  const order = await Order.findOne(query).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    message: 'Order retrieved successfully',
    data: order
  });
}));

router.get('/number/:orderNumber', authenticate, validate(orderNumberSchema, 'params'), asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const query = userRole === 'super_admin' ? { orderNumber } : { orderNumber, user: userId };

  const order = await Order.findOne(query).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    message: 'Order retrieved successfully',
    data: order
  });
}));

router.get('/', authenticate, authorize('super_admin'), validate(orderQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const query = {};
  if (status && status !== '') {
    query.status = status;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / limit);

  res.json({
    success: true,
    message: 'Orders retrieved successfully',
    data: {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}));

router.put('/:id/status', authenticate, authorize('super_admin'), validate(orderIdSchema, 'params'), validate(updateOrderStatusSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
}));

module.exports = router;
