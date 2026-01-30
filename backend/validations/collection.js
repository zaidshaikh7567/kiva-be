const zod = require('zod');

const createCollectionSchema = zod.object({
  title: zod.string().optional(),
  category: zod.string().min(1, 'Category is required'),
  video: zod
    .string()
    .url('Video must be a valid URL')
    .optional()
    .or(zod.literal('')), // optional video
  isNew: zod.coerce.boolean().optional(),
  isActive: zod.coerce.boolean().optional(),
});

const updateCollectionSchema = zod.object({
    title: zod.string().optional(),
  category: zod.string().min(1, 'Category is required').optional(),
  video: zod
    .string()
    .url('Video must be a valid URL')
    .optional()
    .or(zod.literal('')), // optional video
  isNew: zod.coerce.boolean().optional(),
  isActive: zod.coerce.boolean().optional(),
});

const collectionIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createCollectionSchema,
  updateCollectionSchema,
  collectionIdSchema,
};
