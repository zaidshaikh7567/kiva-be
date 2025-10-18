const zod = require('zod');

const createCategorySchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  parentId: zod.string().optional(),
});

const updateCategorySchema = zod.object({
  name: zod.string().min(1, 'Name is required').optional(),
  parentId: zod.string().optional(),
});

const categoryIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
};
