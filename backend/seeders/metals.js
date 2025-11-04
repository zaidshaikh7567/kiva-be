const Metal = require('../models/Metal');
const logger = require('../utils/logger');

const metalsData = [
  {
    name: 'Gold',
    color: 'Yellow',
    purityLevels: [
      { karat: 24, priceMultiplier: 1.0, active: true },
      { karat: 18, priceMultiplier: 0.75, active: true },
      { karat: 14, priceMultiplier: 0.58, active: false }
    ]
  },
  {
    name: 'Silver',
    color: 'Silver',
    purityLevels: [
      { karat: 925, priceMultiplier: 0.3, active: true }
    ]
  },
  {
    name: 'Platinum',
    color: 'White',
    purityLevels: [
      { karat: 950, priceMultiplier: 1.5, active: true }
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
