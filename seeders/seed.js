const connectDB = require('../config/database');
const seedCategories = require('./categories');
const seedMetals = require('./metals');
const seedProducts = require('./products');

const seedData = async () => {
  try {
    await connectDB();

    const categories = await seedCategories();
    const metals = await seedMetals();
    const products = await seedProducts(categories, metals);

    console.log('Seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
