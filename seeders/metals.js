const Metal = require('../models/Metal');

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
  await Metal.deleteMany({});
  const metals = await Metal.insertMany(metalsData);
  console.log('Metals seeded');
  return metals;
};

module.exports = seedMetals;
