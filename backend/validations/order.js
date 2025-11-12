const zod = require('zod');

const addressSchema = zod.object({
  street: zod.string().min(1, 'Street is required').trim(),
  city: zod.string().min(1, 'City is required').trim(),
  state: zod.string().min(1, 'State is required').trim(),
  zipCode: zod.string().min(1, 'Zip code is required').trim(),
  country: zod.string().min(1, 'Country is required').trim()
});

const createOrderSchema = zod.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: zod.string().min(1, 'Payment method is required').trim(),
  notes: zod.string().trim().optional()
});

const orderIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

const orderNumberSchema = zod.object({
  orderNumber: zod.string().min(1, 'Order number is required').trim(),
});

const updateOrderStatusSchema = zod.object({
  status: zod.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid order status' })
  })
});

const orderQuerySchema = zod.object({
  page: zod.coerce.number().int().min(1).optional().default(1),
  limit: zod.coerce.number().int().min(1).max(100).optional().default(10),
  status: zod.string().optional().refine((val) => {
    if (!val || val === '') return true;
    return ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(val);
  }, {
    message: 'Invalid status value. Must be one of: pending, processing, shipped, delivered, cancelled'
  }),
  sortBy: zod.enum(['createdAt', 'updatedAt', 'total']).optional().default('createdAt'),
  sortOrder: zod.enum(['asc', 'desc']).optional().default('desc')
});

module.exports = {
  createOrderSchema,
  orderIdSchema,
  orderNumberSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  addressSchema
};
