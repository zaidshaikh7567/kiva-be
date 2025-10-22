const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Metal = require('../models/Metal');
const Stone = require('../models/Stone');
const Product = require('../models/Product');
const logger = require('../utils/logger');
const seedUsers = require('./users');
const seedCategories = require('./categories');
const seedMetals = require('./metals');
const seedStones = require('./stones');
const seedProducts = require('./products');

const seedData = async () => {
  try {
    logger.info('Connecting to database...');
    await connectDB();
    logger.info('Database connected successfully');

    logger.info('Clearing existing data...');
    await Product.deleteMany({});
    await Stone.deleteMany({});
    await Metal.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    logger.info('Existing data cleared');

    logger.info('Seeding users...');
    const users = await seedUsers();
    logger.info(`Users seeded successfully: ${users.length} users created`);

    logger.info('Seeding categories...');
    const categories = await seedCategories();
    logger.info(`Categories seeded successfully: ${categories.length} categories created`);

    logger.info('Seeding metals...');
    const metals = await seedMetals();
    logger.info(`Metals seeded successfully: ${metals.length} metals created`);

    logger.info('Seeding stones...');
    const stones = await seedStones();
    logger.info(`Stones seeded successfully: ${stones.length} stones created`);

    logger.info('Seeding products...');
    const products = await seedProducts(categories, metals, stones);
    logger.info(`Products seeded successfully: ${products.length} products created`);

    logger.info('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
