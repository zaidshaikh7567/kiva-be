const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncErrorHandler');
const notificationService = require('../utils/notificationService');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { z } = require('zod');

/**
 * @route   POST /api/notifications/token
 * @desc    Save/update FCM token for authenticated user
 * @access  Private
 */
router.post(
  '/token',
  authenticate,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      token: z.string().min(1, 'Token is required'),
    });

    const { token } = schema.parse(req.body);
    const userId = req.user.id;

    // Add token to user's tokens array (avoid duplicates)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: token } }, // $addToSet prevents duplicates
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token saved successfully',
      tokens: user.fcmTokens,
    });
  })
);

/**
 * @route   DELETE /api/notifications/token
 * @desc    Remove FCM token for authenticated user
 * @access  Private
 */
router.delete(
  '/token',
  authenticate,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      token: z.string().min(1, 'Token is required'),
    });

    const { token } = schema.parse(req.body);
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { fcmTokens: token } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token removed successfully',
      tokens: user.fcmTokens,
    });
  })
);

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to authenticated user
 * @access  Private
 */
router.post(
  '/send',
  authenticate,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      image: z.string().url().optional(),
      data: z.record(z.any()).optional(),
    });

    const notification = schema.parse(req.body);
    const userId = req.user.id;

    const result = await notificationService.sendToUser(userId, notification, notification.data || {});

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      result,
    });
  })
);

/**
 * @route   POST /api/notifications/send-to-user/:userId
 * @desc    Send notification to a specific user (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/send-to-user/:userId',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {

    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      image: z.string().url().optional(),
      data: z.record(z.any()).optional(),
    });

    const notification = schema.parse(req.body);
    const { userId } = req.params;

    const result = await notificationService.sendToUser(userId, notification, notification.data || {});

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      result,
    });
  })
);

/**
 * @route   POST /api/notifications/send-to-all
 * @desc    Send notification to all users (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/send-to-all',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {

    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      image: z.string().url().optional(),
      data: z.record(z.any()).optional(),
      filters: z.record(z.any()).optional(), // Optional filters like { role: 'user' }
    });

    const { filters, ...notification } = schema.parse(req.body);

    const result = await notificationService.sendToAllUsers(
      notification,
      notification.data || {},
      filters || {}
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      result,
    });
  })
);

/**
 * @route   POST /api/notifications/send-to-device
 * @desc    Send notification to a specific device token (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/send-to-device',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {

    const schema = z.object({
      token: z.string().min(1, 'Token is required'),
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      image: z.string().url().optional(),
      data: z.record(z.any()).optional(),
    });

    const { token, ...notification } = schema.parse(req.body);

    const result = await notificationService.sendToDevice(token, notification, notification.data || {});

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      result,
    });
  })
);

/**
 * @route   GET /api/notifications/tokens
 * @desc    Get user's FCM tokens
 * @access  Private
 */
router.get(
  '/tokens',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('fcmTokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      tokens: user.fcmTokens || [],
    });
  })
);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for authenticated user
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';

    const query = { user: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: userId, read: false }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit,
      },
      unreadCount,
    });
  })
);

/**
 * @route   POST /api/notifications
 * @desc    Create a notification (used internally when sending notifications)
 * @access  Private (Admin or System)
 */
router.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      userId: z.string().min(1, 'User ID is required'),
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      image: z.string().url().optional().nullable(),
      type: z.string().optional(),
      data: z.record(z.any()).optional(),
    });

    const notificationData = schema.parse(req.body);

    const notification = new Notification({
      user: notificationData.userId,
      title: notificationData.title,
      body: notificationData.body,
      image: notificationData.image || null,
      type: notificationData.type || 'general',
      data: notificationData.data || {},
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  })
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put(
  '/:id/read',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  })
);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read for authenticated user
 * @access  Private
 */
router.put(
  '/read-all',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  })
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  })
);

module.exports = router;

