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
  const { shippingAddress, billingAddress, phone, paymentMethod, notes, currency = 'USD', exchangeRate } = req.body;
  const normalizedPaymentMethod = (paymentMethod || '').toLowerCase();
  const paypalFlowMethods = ['paypal', 'card'];

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

  if (paypalFlowMethods.includes(normalizedPaymentMethod)) {
    // Convert prices from USD to selected currency if needed
    const normalizedCurrency = (currency || 'USD').toUpperCase();
    
    // PayPal unsupported currencies that MUST be converted to USD
    const PAYPAL_UNSUPPORTED = ['INR'];
    const isUnsupportedCurrency = PAYPAL_UNSUPPORTED.includes(normalizedCurrency);
    let currencyNotice = null;
    
    // For unsupported currencies, exchangeRate is REQUIRED
    if (isUnsupportedCurrency && (!exchangeRate || exchangeRate <= 0)) {
      return res.status(400).json({
        success: false,
        message: `Currency ${normalizedCurrency} is not supported by PayPal. Please provide a valid exchange rate to convert to USD.`
      });
    }
    
    // Validate exchange rate for non-USD currencies
    if (normalizedCurrency !== 'USD' && (!exchangeRate || exchangeRate <= 0)) {
      console.warn(`Warning: Exchange rate not provided for currency ${normalizedCurrency}. Using rate 1.0 (no conversion).`);
    }
    
    const conversionRate = (normalizedCurrency !== 'USD' && exchangeRate && exchangeRate > 0) ? exchangeRate : 1;
    
    console.log(`Currency conversion: ${normalizedCurrency}, Rate: ${conversionRate}, Original Subtotal (USD): ${subtotal}`);
    
    if (isUnsupportedCurrency) {
      currencyNotice = {
        type: 'currency_conversion',
        currency: normalizedCurrency,
        exchangeRate: conversionRate,
        message: `PayPal does not support ${normalizedCurrency} for payments. Your payment will be processed in USD using the current exchange rate (1 USD ≈ ${conversionRate} ${normalizedCurrency}). The amount shown in ${normalizedCurrency} is for reference only.`,
      };
    }
    
    // Create order data with converted prices for PayPal
    const convertedOrderItems = orderItems.map(item => {
      const convertedUnitPrice = item.unitPrice * conversionRate;
      const convertedTotalPrice = item.totalPrice * conversionRate;
      const convertedStonePrice = (item.stonePrice || 0) * conversionRate;
      
      return {
        ...item,
        unitPrice: convertedUnitPrice,
        totalPrice: convertedTotalPrice,
        stonePrice: convertedStonePrice
      };
    });
    
    const convertedSubtotal = subtotal * conversionRate;
    const convertedTotal = convertedSubtotal;
    
    console.log(`Converted Subtotal (${normalizedCurrency}): ${convertedSubtotal}`);
    
    const orderData = {
      items: convertedOrderItems,
      subtotal: convertedSubtotal,
      total: convertedTotal
    };

    try {
      // For PayPal, check if currency needs conversion (e.g., INR to USD)
      // Pass exchangeRate to allow conversion of unsupported currencies
      console.log(`[Order] Creating PayPal order with currency: ${normalizedCurrency}, exchangeRate: ${exchangeRate}`);
      console.log(`[Order] Order data total: ${orderData.total} ${normalizedCurrency}`);
      const paypalOrder = await createPayPalOrder(orderData, normalizedCurrency, exchangeRate);

      const tempOrder = new Order({
        user: userId,
        items: orderItems,
        subtotal: subtotal,
        total: subtotal,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        phone: phone,
        paymentMethod: normalizedPaymentMethod || 'paypal',
        currency: currency?.toUpperCase() || 'USD',
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
          paymentMethod: normalizedPaymentMethod || 'paypal',
          currencyNotice
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
    paymentMethod: normalizedPaymentMethod || paymentMethod,
    currency: currency?.toUpperCase() || 'USD',
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
  const { paypalOrderId, paymentMethod } = req.body;

  try {
    const captureResult = await capturePayPalPayment(paypalOrderId);
    console.log('captureResult :', captureResult);

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

    // Update payment status based on capture result
    if (captureResult.status !== 'COMPLETED') {
      tempOrder.paymentStatus = 'failed';
      await tempOrder.save();
      
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
        data: { order: tempOrder }
      });
    }

    // Payment completed successfully - update order status
    // Safely extract transaction ID with null checks
    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    if (capture?.id) {
      tempOrder.paypalTransactionId = capture.id;
    }
    
    // Extract card details if payment method is card
    if (paymentMethod && paymentMethod.toLowerCase() === 'card') {
      const cardInfo = captureResult.payment_source?.card;
      if (cardInfo) {
        tempOrder.cardDetails = {
          last4: cardInfo.last_digits || null,
          brand: cardInfo.brand || null,
          expiryMonth: cardInfo.expiry?.substring(5, 7) || null,
          expiryYear: cardInfo.expiry?.substring(0, 4) || null
        };
      }
      
      // Also check in capture object for card details
      const captureCardInfo = capture?.payment_source?.card;
      if (captureCardInfo && !tempOrder.cardDetails?.last4) {
        tempOrder.cardDetails = {
          last4: captureCardInfo.last_digits || null,
          brand: captureCardInfo.brand || null,
          expiryMonth: captureCardInfo.expiry?.substring(5, 7) || null,
          expiryYear: captureCardInfo.expiry?.substring(0, 4) || null
        };
      }
    }
    
    tempOrder.paymentStatus = 'completed';
    tempOrder.status = 'processing';
    if (paymentMethod) {
      tempOrder.paymentMethod = paymentMethod.toLowerCase();
    }

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

  // Ensure orders is always an array
  const ordersArray = Array.isArray(orders) ? orders : [];

  res.json({
    success: true,
    message: 'Orders retrieved successfully',
    data: {
      orders: ordersArray,
      pagination: {
        currentPage: parseInt(page) || 1,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPages,
        totalOrders,
        total: totalOrders,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
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
