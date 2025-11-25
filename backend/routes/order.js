const express = require('express');

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Metal = require('../models/Metal');
const Stone = require('../models/Stone');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailUtil');
const { getOrderConfirmationEmailTemplate } = require('../utils/emailTemplates');
const { createPayPalOrder, capturePayPalPayment } = require('../utils/paypalUtil');
const {
  createOrderSchema,
  orderIdSchema,
  orderNumberSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  capturePayPalPaymentSchema
} = require('../validations/order');
const validate = require('../middleware/validate');

const router = express.Router();

// Get PayPal client ID for frontend
router.get('/paypal-client-id', asyncHandler(async (req, res) => {
  const { PAYPAL_CLIENT_ID, NODE_ENV } = require('../config/env');
  
  if (!PAYPAL_CLIENT_ID) {
    return res.status(500).json({
      success: false,
      message: 'PayPal client ID not configured'
    });
  }

  res.json({
    success: true,
    data: {
      clientId: PAYPAL_CLIENT_ID.trim(),
      environment: NODE_ENV === 'production' ? 'production' : 'sandbox'
    }
  });
}));

router.post('/', authenticate, validate(createOrderSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, billingAddress, phone, paymentMethod, notes, currency = 'USD' } = req.body;

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

  if (paymentMethod.toLowerCase() === 'paypal' || paymentMethod.toLowerCase() === 'card') {
    const orderData = {
      items: orderItems,
      subtotal: subtotal,
      total: subtotal
    };

    try {
      const paypalOrder = await createPayPalOrder(orderData, currency);

      const tempOrder = new Order({
        user: userId,
        items: orderItems,
        subtotal: subtotal,
        total: subtotal,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        phone: phone,
        paymentMethod: paymentMethod.toLowerCase(),
        paypalOrderId: paypalOrder.id,
        paymentStatus: 'pending',
        status: 'pending',
        notes: notes
      });

      await tempOrder.save();

      // Safely extract approval URL
      const approveLink = paypalOrder.links?.find(link => link.rel === 'approve');
      const approvalUrl = approveLink?.href || null;

      if (!approvalUrl) {
        console.error('PayPal approval URL not found in response:', paypalOrder);
        throw new Error('PayPal approval URL not found. Please try again.');
      }

      res.json({
        success: true,
        message: 'PayPal order created successfully',
        data: {
          paypalOrderId: paypalOrder.id,
          approvalUrl: approvalUrl,
          orderData: orderData,
          paymentMethod: 'paypal'
        }
      });
    } catch (error) {
      console.error('PayPal create order error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create PayPal order',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    return;
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
    notes: notes,
    paymentStatus: 'completed'
  });

  await order.save();
  await order.populate('user', 'name email');

  try {
    if (order.user?.email) {
      const orderEmailHtml = getOrderConfirmationEmailTemplate(order);
      await sendEmail(
        order.user.email,
        `Thank You for Your Order #${order.orderNumber} - Kiva Jewelry`,
        orderEmailHtml
      );
    }
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
  }

  await Cart.deleteMany({ user: userId });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
}));

router.post('/capture-paypal', authenticate, validate(capturePayPalPaymentSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { paypalOrderId } = req.body;

  try {
    const captureResult = await capturePayPalPayment(paypalOrderId);

    if (captureResult.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    const tempOrder = await Order.findOne({
      paypalOrderId: paypalOrderId,
      user: userId,
      status: 'pending',
      paymentStatus: 'pending'
    });

    if (!tempOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Safely extract transaction ID with null checks
    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    if (capture?.id) {
      tempOrder.paypalTransactionId = capture.id;
    }
    tempOrder.paymentStatus = 'completed';
    tempOrder.status = 'processing';

    await tempOrder.save();
    await tempOrder.populate('user', 'name email');

    try {
      if (tempOrder.user?.email) {
        const orderEmailHtml = getOrderConfirmationEmailTemplate(tempOrder);
        await sendEmail(
          tempOrder.user.email,
          `Thank You for Your Order #${tempOrder.orderNumber} - Kiva Jewelry`,
          orderEmailHtml
        );
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    await Cart.deleteMany({ user: userId });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: tempOrder
    });

  } catch (error) {
    console.error('PayPal capture payment error:', error);

    try {
      await Order.findOneAndUpdate(
        { paypalOrderId: paypalOrderId },
        { paymentStatus: 'failed' }
      );
    } catch (updateError) {
      console.error('Failed to update order status:', updateError);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal payment'
    });
  }
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
