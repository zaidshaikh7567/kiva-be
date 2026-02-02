const zod = require('zod');
const arrayFromUnknown = zod.preprocess((val) => {
  if (val === undefined || val === null || val === '') return undefined;

  if (Array.isArray(val)) return val;

  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [val];
    }
  }

  return undefined;
}, zod.array(zod.string()).optional());
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
  stoneTypeId: zod.preprocess((val) => {
    // Allow empty string/null so the route handler can clear the stone
    if (val === '' || val === null || val === 'null') {
      return '';
    }
    // If empty (undefined) or the literal string 'undefined', skip validation entirely
    if (val === undefined || val === 'undefined') {
      return undefined;
    }
    // If it's a valid ObjectId, return it
    if (typeof val === 'string' && val.length === 24 && /^[0-9a-fA-F]{24}$/.test(val)) {
      return val;
    }
    // If invalid format, return undefined (silently ignore invalid values)
    return undefined;
  }, zod.union([
    zod.string().regex(/^[0-9a-fA-F]{24}$/),
    zod.literal(''),
    zod.undefined()
  ]).optional()),
  careInstruction: zod.string().optional(),
  shape: zod.string().optional(),
  color: zod.string().optional(),
  clarity: arrayFromUnknown,
  certificate: arrayFromUnknown,
  isBand: zod.preprocess((val) => {
    if (val === undefined || val === null || val === '') {
      return undefined;
    }
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'string') {
      const normalized = val.trim().toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false;
      }
    }
    return undefined;
  }, zod.boolean().optional()),
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
  stoneTypeId: zod.preprocess((val) => {
    if (val === '' || val === null || val === 'null') {
      return '';
    }
    if (val === undefined || val === 'undefined') {
      return undefined;
    }
    if (typeof val === 'string' && val.length === 24 && /^[0-9a-fA-F]{24}$/.test(val)) {
      return val;
    }
    return undefined;
  }, zod.union([
    zod.string().regex(/^[0-9a-fA-F]{24}$/),
    zod.literal(''),
    zod.undefined()
  ]).optional()),
  careInstruction: zod.string().optional(),
  shape: zod.string().optional(),
  color: zod.string().optional(),
  clarity: arrayFromUnknown,
  certificate: arrayFromUnknown,
  isBand: zod.preprocess((val) => {
    if (val === undefined || val === null || val === '') {
      return undefined;
    }
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'string') {
      const normalized = val.trim().toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false;
      }
    }
    return undefined;
  }, zod.boolean().optional()),
});

const productIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
};
