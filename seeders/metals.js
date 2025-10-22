const Metal = require('../models/Metal');
const logger = require('../utils/logger');

const metalsData = [
  {
    name: 'Gold',
    color: 'Yellow',
    purityLevels: [
      { karat: 24, priceMultiplier: 1.0 },
      { karat: 18, priceMultiplier: 0.75 },
      { karat: 14, priceMultiplier: 0.58 }
    ]
  },
  {
    name: 'Silver',
    color: 'Silver',
    purityLevels: [
      { karat: 925, priceMultiplier: 0.3 }
    ]
  },
  {
    name: 'Platinum',
    color: 'White',
    purityLevels: [
      { karat: 950, priceMultiplier: 1.5 }
    ]
  }
];

const seedMetals = async () => {
  try {
    const metals = await Metal.insertMany(metalsData);
    return metals;
  } catch (error) {
    logger.error('Error seeding metals:', error);
    throw error;
  }
};

module.exports = seedMetals;
