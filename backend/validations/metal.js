const zod = require('zod');

const purityLevelSchema = zod.object({
  karat: zod.number().min(0, 'Karat must be non-negative'),
  priceMultiplier: zod.number().min(0, 'Price multiplier must be non-negative'),
});

const createMetalSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  color: zod.string().regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Color must be a valid hex color code (e.g., #FF0000 or #FF0000FF)'),
  purityLevels: zod.array(purityLevelSchema).min(1, 'At least one purity level is required'),
  active: zod.boolean().optional(),
});

const updateMetalSchema = zod.object({
  name: zod.string().min(1, 'Name is required').optional(),
  color: zod.string().regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Color must be a valid hex color code (e.g., #FF0000 or #FF0000FF)').optional(),
  purityLevels: zod.array(purityLevelSchema).min(1, 'At least one purity level is required').optional(),
  active: zod.boolean().optional(),
});

const metalIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createMetalSchema,
  updateMetalSchema,
  metalIdSchema,
};
