const zod = require('zod');

const createContactSchema = zod.object({
  name: zod.string().min(2, 'Name is required'),
  email: zod.string().email('Email must be a valid email address').min(1, 'Email is required'),
  phone: zod.string().optional(),
  message: zod.string().min(10, 'Message is required'),
  service: zod.string().optional(),
  designDescription: zod.string().optional(),
  preferredMetal: zod.string().optional(),
  preferredStone: zod.string().optional(),
  budget: zod.string().optional(),
  timeline: zod.string().optional(),
  size: zod.string().optional(),
  mediaUrls: zod.array(zod.object({
    type: zod.enum(['image', 'video']),
    url: zod.string().url('Invalid URL format')
  })).optional(),
});

const contactIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createContactSchema,
  contactIdSchema,
};

