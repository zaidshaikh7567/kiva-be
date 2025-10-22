const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailUtil');
const { loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } = require('../validations/auth');
const validate = require('../middleware/validate');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../config/env');

const router = express.Router();

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, active: true });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }
  });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.active) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, newRefreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Token refreshed',
      data: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
}));

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = new User({ name, email, password, role: 'user' });
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }
  });
}));

router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
}));

router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, active: true });
  if (!user) {
    return res.json({ success: true, message: 'If the email exists, an OTP has been sent' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const emailResult = await sendEmail(
    email,
    'Password Reset OTP',
    `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
  );

  if (!emailResult.success) {
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }

  res.json({ success: true, message: 'OTP sent to your email' });
}));

router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email, active: true });
  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.password = newPassword;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully' });
}));

router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
  res.json({ success: true, message: 'Profile retrieved successfully', data: user });
}));

router.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select('-password -otp -otpExpires');
  if (!user) throw new Error('User not found');

  res.json({ success: true, message: 'Profile updated successfully', data: user });
}));



module.exports = router;
