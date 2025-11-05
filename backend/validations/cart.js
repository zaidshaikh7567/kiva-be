const zod = require('zod');

const addToCartSchema = zod.object({
  productId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product ObjectId'),
  metalId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid metal ObjectId'),
  purityLevel: zod.object({
    karat: zod.coerce.number().min(0),
    priceMultiplier: zod.coerce.number().min(0)
  }),
  stoneTypeId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid stone ObjectId').optional(),
  ringSize: zod.string().optional(),
  quantity: zod.coerce.number().int().min(1).optional()
});

const updateCartSchema = zod.object({
  quantity: zod.coerce.number().int().min(1).optional(),
  metalId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid metal ObjectId').optional(),
  purityLevel: zod.object({
    karat: zod.coerce.number().min(0),
    priceMultiplier: zod.coerce.number().min(0)
  }).optional(),
  stoneTypeId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid stone ObjectId').optional(),
  ringSize: zod.string().optional()
});

const cartIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
  cartIdSchema,
};
