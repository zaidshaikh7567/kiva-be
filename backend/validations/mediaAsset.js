const zod = require('zod');

const createMediaAssetSchema = zod.object({
  title: zod.string().max(200).optional().or(zod.literal('')),
  description: zod.string().max(500).optional().or(zod.literal('')),
  type: zod.enum(['image', 'video']),
  page: zod
    .preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return val;
    }, zod.enum(['home', 'contact', 'about', 'favorites', 'custom', 'ring', 'bracelet', 'earring', 'necklace', 'other']).optional()),
  section: zod.string().max(100).optional().or(zod.literal('')),
  key: zod.string().max(100).optional().or(zod.literal('')),
  isActive: zod
    .preprocess((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const normalized = val.trim().toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
        if (['false', '0', 'no', 'off'].includes(normalized)) return false;
      }
      return undefined;
    }, zod.boolean().optional()),
  sortOrder: zod
    .preprocess(
      (val) => (val === undefined || val === '' ? undefined : Number(val)),
      zod.number().int().optional()
    )
    .optional(),
});

const updateMediaAssetSchema = createMediaAssetSchema.partial();

const mediaAssetIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

module.exports = {
  createMediaAssetSchema,
  updateMediaAssetSchema,
  mediaAssetIdSchema,
};


