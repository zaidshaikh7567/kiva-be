const zod = require('zod');

const createProductSchema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  description: zod.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return (Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0));
    } catch {
      return false;
    }
  }, 'Description must be valid JSON object or array'),
  subDescription: zod.string().optional(),
  price: zod.coerce.number().min(0, 'Price must be non-negative'),
  quantity: zod.coerce.number().int().min(0, 'Quantity must be non-negative integer'),
  categoryId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category ObjectId'),
  metalIds: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('metalIds must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid metal ObjectId')).optional()),
  stoneTypeId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid stone ObjectId').optional(),
  careInstruction: zod.string().optional(),
  shape: zod.string().optional(),
  color: zod.string().optional(),
  clarity: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('clarity must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string()).optional()),
  certificate: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('certificate must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string()).optional()),
});

const updateProductSchema = zod.object({
  title: zod.string().min(1, 'Title is required').optional(),
  description: zod.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return (Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0));
    } catch {
      return false;
    }
  }, 'Description must be valid JSON object or array').optional(),
  subDescription: zod.string().optional(),
  price: zod.coerce.number().min(0, 'Price must be non-negative').optional(),
  quantity: zod.coerce.number().int().min(0, 'Quantity must be non-negative integer').optional(),
  categoryId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category ObjectId').optional(),
  metalIds: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('metalIds must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid metal ObjectId')).optional()),
  stoneTypeId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid stone ObjectId').optional(),
  careInstruction: zod.string().optional(),
  shape: zod.string().optional(),
  color: zod.string().optional(),
  clarity: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('clarity must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string()).optional()),
  certificate: zod.string().optional().transform((val) => {
    if (!val) return undefined;
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new Error('certificate must be a valid JSON array');
    }
  }).pipe(zod.array(zod.string()).optional()),
});

const productIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
};
