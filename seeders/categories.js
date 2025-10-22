const Category = require('../models/Category');
const logger = require('../utils/logger');

const categoriesData = [
  {
    name: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
  },
  {
    name: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
  },
  {
    name: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
  },
  {
    name: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop'
  }
];

const seedCategories = async () => {
  try {
    const categories = await Category.insertMany(categoriesData);
    return categories;
  } catch (error) {
    logger.error('Error seeding categories:', error);
    throw error;
  }
};

module.exports = seedCategories;
