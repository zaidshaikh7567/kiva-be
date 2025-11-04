const zod = require('zod');

const addFavoriteSchema = zod.object({
  productId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product ObjectId'),
});

const favoriteIdSchema = zod.object({
  id: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId'),
});

const productIdSchema = zod.object({
  productId: zod.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product ObjectId'),
});

module.exports = {
  addFavoriteSchema,
  favoriteIdSchema,
  productIdSchema,
};

