const Stone = require('../models/Stone');

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
  await Stone.deleteMany({});
  const stones = await Stone.insertMany(stonesData);
  console.log('Stones seeded');
  return stones;
};

module.exports = seedStones;
