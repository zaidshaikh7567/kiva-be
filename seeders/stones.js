const Stone = require('../models/Stone');
const logger = require('../utils/logger');

const stonesData = [
  {
    name: 'Diamond',
    price: 5000,
    shape: 'Round'
  },
  {
    name: 'Ruby',
    price: 800,
    shape: 'Oval'
  },
  {
    name: 'Sapphire',
    price: 1200,
    shape: 'Princess'
  },
  {
    name: 'Emerald',
    price: 900,
    shape: 'Square'
  },
  {
    name: 'Amethyst',
    price: 200,
    shape: 'Heart'
  }
];

const seedStones = async () => {
  try {
    const stones = await Stone.insertMany(stonesData);
    return stones;
  } catch (error) {
    logger.error('Error seeding stones:', error);
    throw error;
  }
};

module.exports = seedStones;
