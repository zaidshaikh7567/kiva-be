const zod = require('zod');

const createReviewSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().email('Email must be a valid email address').min(1, 'Email is required'),
  comment: zod.string().min(1, 'Comment is required'),
  rating: zod.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

const updateReviewSchema = zod.object({
  name: zod.string().min(1, 'Name is required').optional(),
  email: zod.string().email('Email must be a valid email address').min(1, 'Email is required').optional(),
  comment: zod.string().min(1, 'Comment is required').optional(),
  rating: zod.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
});

const reviewIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
};

