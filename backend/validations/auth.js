const zod = require('zod');

const inputRoleSchema = zod.preprocess((val) => {
  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();
    if (normalized === 'super_admin') {
      return 'admin';
    }
    return normalized;
  }
  return val;
}, zod.enum(['admin', 'user'], {
  errorMap: () => ({ message: 'Role must be either admin or user' })
}));

const loginSchema = zod.object({
  email: zod.email('Invalid email format'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  role: inputRoleSchema
});

const registerSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: zod.email('Invalid email format'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  role: inputRoleSchema
});

const changePasswordSchema = zod.object({
  currentPassword: zod.string().min(1, 'Current password is required'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters')
});

const forgotPasswordSchema = zod.object({
  email: zod.string().email('Invalid email format'),
  role: inputRoleSchema.optional()
});

const resetPasswordSchema = zod.object({
  email: zod.email('Invalid email format'),
  otp: zod.string().length(6, 'OTP must be 6 digits'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters'),
  role: inputRoleSchema.optional()
});

const updateProfileSchema = zod.object({
  name: zod.string().max(100, 'Name too long').optional()
}).passthrough(); // Allow additional fields like profileImage (handled by multer)

const googleAuthSchema = zod.object({
  code: zod.string().min(1, 'Authorization code is required'),
  redirectUri: zod.string().url('Invalid redirect URI').optional()
});

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  googleAuthSchema
};
