const zod = require('zod');

const createStoneSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  price: zod.coerce.number().min(0, 'Price must be non-negative'),
  shape: zod.string().min(1, 'Shape is required'),
  active: zod.boolean().optional(),
});

const updateStoneSchema = zod.object({
  name: zod.string().min(1, 'Name is required').optional(),
  price: zod.coerce.number().min(0, 'Price must be non-negative').optional(),
  shape: zod.string().min(1, 'Shape is required').optional(),
  active: zod.boolean().optional(),
});

const stoneIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createStoneSchema,
  updateStoneSchema,
  stoneIdSchema,
};
