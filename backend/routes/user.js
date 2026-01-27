const express = require('express');

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { updateUserSchema, userIdSchema, userListQuerySchema } = require('../validations/user');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, authorize('super_admin'), validate(userListQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Base filter: exclude super_admin from list
  const filter = { role: { $ne: 'super_admin' } };

  const { search, role, active } = req.query;

  // Optional role filter (if we ever want to list only users, etc.)
  if (role) {
    filter.role = role;
  }

  // Optional active status filter: expects 'true' or 'false' as string
  if (active === 'true') {
    filter.active = true;
  } else if (active === 'false') {
    filter.active = false;
  }

  // Optional search filter: match name or email (case-insensitive)
  let query = User.find(filter);
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query = query.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    });
  }

  const totalRecords = await query.clone().countDocuments();
  const users = await query
    .select('-password -otp -otpExpires')
    .skip(skip)
    .limit(limit);
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.get('/:id', authenticate, authorize('super_admin'), validate(userIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password -otp -otpExpires');
  if (!user) throw new Error('User not found');
  res.json({ success: true, message: 'User retrieved successfully', data: user });
}));

router.put('/:id', authenticate, authorize('super_admin'), validate(userIdSchema, 'params'), validate(updateUserSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (active !== undefined) updateData.active = active;

  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password -otp -otpExpires');
  if (!user) throw new Error('User not found');

  res.json({ success: true, message: 'User updated successfully', data: user });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(userIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  res.json({ success: true, message: 'User deleted successfully' });
}));

module.exports = router;
