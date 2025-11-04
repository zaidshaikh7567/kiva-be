const express = require('express');

const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createReviewSchema, updateReviewSchema, reviewIdSchema } = require('../validations/review');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Review.countDocuments();
  const reviews = await Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.post('/', validate(createReviewSchema), asyncHandler(async (req, res) => {
  const { name, email, comment, rating } = req.body;

  const review = new Review({
    name,
    email,
    comment,
    rating
  });

  await review.save();

  res.status(201).json({ success: true, message: 'Review created successfully', data: review });
}));

router.get('/:id', validate(reviewIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found');
  res.json({ success: true, message: 'Review retrieved successfully', data: review });
}));

router.put('/:id', authenticate, authorize('super_admin'), validate(reviewIdSchema, 'params'), validate(updateReviewSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
  if (!review) throw new Error('Review not found');

  res.json({ success: true, message: 'Review updated successfully', data: review });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(reviewIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new Error('Review not found');
  res.json({ success: true, message: 'Review deleted successfully' });
}));

module.exports = router;

