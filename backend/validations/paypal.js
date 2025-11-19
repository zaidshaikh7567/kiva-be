const zod = require('zod');

const addressSchema = zod.object({
  street: zod.string().min(1, 'Street is required').trim(),
  city: zod.string().min(1, 'City is required').trim(),
  state: zod.string().min(1, 'State is required').trim(),
  zipCode: zod.string().min(1, 'Zip code is required').trim(),
  country: zod.string().min(1, 'Country is required').trim()
});

const createPayPalOrderSchema = zod.object({
  currency: zod.string().length(3, 'Currency must be 3 characters').optional().default('USD')
});

const capturePayPalPaymentSchema = zod.object({
  paypalOrderId: zod.string().min(1, 'PayPal order ID is required').trim(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  phone: zod.string().min(1, 'Phone is required').trim(),
  notes: zod.string().trim().optional()
});

const paypalOrderIdSchema = zod.object({
  paypalOrderId: zod.string().min(1, 'PayPal order ID is required').trim()
});

module.exports = {
  createPayPalOrderSchema,
  capturePayPalPaymentSchema,
  paypalOrderIdSchema
};
