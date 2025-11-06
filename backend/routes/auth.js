const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailUtil');
const { loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema, googleAuthSchema } = require('../validations/auth');
const validate = require('../middleware/validate');
const createMulter = require('../utils/uploadUtil');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } = require('../config/env');

// Multer configuration for profile image upload
const upload = createMulter({ 
  storage: 'cloudinary', 
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], 
  maxSize: 2 * 1024 * 1024, // 2MB
  folder: 'profile-images' 
});

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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profileImage: user.profileImage || null
      },
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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profileImage: user.profileImage || null
      },
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

router.put('/profile', authenticate, upload.single('profileImage'), validate(updateProfileSchema), asyncHandler(async (req, res) => {
  const { name } = req.body;
  const updateData = {};

  // Only update name if provided and not empty
  if (name && name.trim().length > 0) {
    updateData.name = name.trim();
  }

  // Handle profile image upload (optional - only if file is uploaded)
  if (req.file) {
    updateData.profileImage = req.file.path;
  }

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'No valid fields provided for update. Please provide name or profileImage.' 
    });
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password -otp -otpExpires');
  if (!user) throw new Error('User not found');

  res.json({ success: true, message: 'Profile updated successfully', data: user });
}));

// Google OAuth Login/Signup (handles both login and signup)
router.post('/google', validate(googleAuthSchema), asyncHandler(async (req, res) => {
  const { code, redirectUri } = req.body;

  // Validate environment variables
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL) {
    throw new Error('Google OAuth credentials are not configured. Please check environment variables.');
  }

  // Use redirect URI from request if provided, otherwise use environment variable
  // The redirect URI must match exactly what was used when obtaining the authorization code
  const finalRedirectUri = redirectUri || GOOGLE_REDIRECT_URL;

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: finalRedirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      throw new Error('Failed to obtain access token from Google');
    }

    // 2. Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { email, name, picture, given_name, family_name, id: googleId } = userResponse.data;

    if (!email) {
      throw new Error('Email not provided by Google');
    }

    // 3. Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    let isNewUser = false;

    if (!user) {
      // Sign up: Create new user with Google auth
      isNewUser = true;
      user = new User({
        name: name || `${given_name || ''} ${family_name || ''}`.trim() || email.split('@')[0],
        email,
        googleId,
        password: crypto.randomBytes(32).toString('hex'), // Random password for Google users (won't be used)
        role: 'user',
        active: true,
        profileImage: picture || null // Set profile image from Google if available
      });
      await user.save();
    } else {
      // Login: Update existing user
      isNewUser = false;
      
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
      }
      
      // Update profile information if changed
      if (name && name !== user.name) {
        user.name = name;
      }
      
      // Update profile image from Google if user doesn't have one
      if (!user.profileImage && picture) {
        user.profileImage = picture;
      }
      
      await user.save();
    }

    // 4. Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // 5. Return response with appropriate message
    res.json({
      success: true,
      message: isNewUser ? 'Google signup successful' : 'Google login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || picture || null
        },
        accessToken,
        refreshToken,
        isNewUser
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error.response) {
      // Google API error
      const errorMessage = error.response.data?.error_description || error.response.data?.error || 'Google authentication failed';
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
    
    // Other errors
    return res.status(500).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
}));

module.exports = router;
