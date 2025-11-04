const Stone = require('../models/Stone');
const logger = require('../utils/logger');

const seedStones = async (categories) => {
  try {
    const stonesData = [
      {
        name: 'Diamond',
        price: 5000,
        shape: 'Round',
        category: categories[0] ? categories[0]._id : null
      },
      {
        name: 'Ruby',
        price: 800,
        shape: 'Oval',
        category: categories[0] ? categories[0]._id : null
      },
      {
        name: 'Sapphire',
        price: 1200,
        shape: 'Princess',
        category: categories[1] ? categories[1]._id : null
      },
      {
        name: 'Emerald',
        price: 900,
        shape: 'Square',
        category: categories[1] ? categories[1]._id : null
      },
      {
        name: 'Amethyst',
        price: 200,
        shape: 'Heart',
        category: categories[2] ? categories[2]._id : null
      }
    ];

    const stones = await Stone.insertMany(stonesData);
    return stones;
  } catch (error) {
    logger.error('Error seeding stones:', error);
    throw error;
  }
};

module.exports = seedStones;
