const zod = require('zod');

const createSocialHandleSchema = zod.object({
  platform: zod.string().min(1, 'Platform is required'),
  url: zod.string().url('URL must be a valid URL').min(1, 'URL is required'),
  isActive: zod.coerce.boolean().optional(),
});

const updateSocialHandleSchema = zod.object({
  platform: zod.string().min(1, 'Platform is required').optional(),
  url: zod.string().url('URL must be a valid URL').min(1, 'URL is required').optional(),
  isActive: zod.coerce.boolean().optional(),
});

const socialHandleIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createSocialHandleSchema,
  updateSocialHandleSchema,
  socialHandleIdSchema,
};

