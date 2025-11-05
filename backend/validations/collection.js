const zod = require('zod');

const createCollectionSchema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  category: zod.string().min(1, 'Category is required'),
  video: zod.string().url('Video must be a valid URL').optional(), // Optional - can be URL string or file upload
  isNew: zod.coerce.boolean().optional(),
  isActive: zod.coerce.boolean().optional(),
});

const updateCollectionSchema = zod.object({
  title: zod.string().min(1, 'Title is required').optional(),
  category: zod.string().min(1, 'Category is required').optional(),
  video: zod.string().url('Video must be a valid URL').optional(), // Made optional - can be URL or file
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
