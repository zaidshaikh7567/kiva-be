const zod = require('zod');

const updateUserSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  active: zod.boolean().optional()
});

const userIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId')
});

// Query params for listing users (admin customers page)
const userListQuerySchema = zod.object({
  page: zod.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: zod.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  // Optional filters
  search: zod.string().optional(),
  role: zod.string().optional(),
  // active expected as string 'true' | 'false' | ''
  active: zod.string().optional()
}).passthrough(); // Allow other query params if needed

module.exports = {
  updateUserSchema,
  userIdSchema,
  userListQuerySchema
};
