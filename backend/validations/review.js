const zod = require('zod');

const mediaSchema = zod.object({
  type: zod.enum(['image', 'video'], {
    required_error: 'Media type is required when media is provided',
    invalid_type_error: 'Media type must be either image or video',
  }),
  url: zod.string().url('Media URL must be a valid URL'),
  publicId: zod.string().min(1, 'Media publicId must be a non-empty string').optional(),
});

const mediaArraySchema = zod.array(mediaSchema).max(10, 'You can upload up to 10 media items');

const createReviewSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().email('Email must be a valid email address').min(1, 'Email is required'),
  comment: zod.string().min(1, 'Comment is required'),
  rating: zod.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  media: mediaArraySchema.optional(),
});

const updateReviewSchema = zod.object({
  name: zod.string().min(1, 'Name is required').optional(),
  email: zod.string().email('Email must be a valid email address').min(1, 'Email is required').optional(),
  comment: zod.string().min(1, 'Comment is required').optional(),
  rating: zod.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  media: zod.union([mediaArraySchema, zod.null()]).optional(),
});

const reviewIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
};

