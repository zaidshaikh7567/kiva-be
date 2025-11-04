const zod = require('zod');

const loginSchema = zod.object({
  email: zod.email('Invalid email format'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: zod.email('Invalid email format'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const changePasswordSchema = zod.object({
  currentPassword: zod.string().min(1, 'Current password is required'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters')
});

const forgotPasswordSchema = zod.object({
  email: zod.string().email('Invalid email format')
});

const resetPasswordSchema = zod.object({
  email: zod.email('Invalid email format'),
  otp: zod.string().length(6, 'OTP must be 6 digits'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters')
});

const updateProfileSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100, 'Name too long')
});

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
};
