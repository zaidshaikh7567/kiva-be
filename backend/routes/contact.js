const express = require('express');

const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncErrorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { createContactSchema, contactIdSchema } = require('../validations/contact');
const validate = require('../middleware/validate');

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', validate(createContactSchema), asyncHandler(async (req, res) => {
  const { name, email, phone, message, service } = req.body;

  const contact = new Contact({
    name,
    email,
    phone: phone || undefined,
    message,
    service: service || 'general'
  });

  await contact.save();

  res.status(201).json({ success: true, message: 'Contact form submitted successfully', data: contact });
}));

// Admin routes - require authentication
router.get('/', authenticate, authorize('super_admin'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalRecords = await Contact.countDocuments();
  const contacts = await Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const totalPages = Math.ceil(totalRecords / limit);

  res.json({
    success: true,
    message: 'Contacts retrieved successfully',
    data: contacts,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit
    }
  });
}));

router.get('/:id', authenticate, authorize('super_admin'), validate(contactIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) throw new Error('Contact not found');
  res.json({ success: true, message: 'Contact retrieved successfully', data: contact });
}));

router.delete('/:id', authenticate, authorize('super_admin'), validate(contactIdSchema, 'params'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new Error('Contact not found');
  res.json({ success: true, message: 'Contact deleted successfully' });
}));

module.exports = router;

