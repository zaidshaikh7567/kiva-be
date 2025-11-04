const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Metal = require('../models/Metal');
const Stone = require('../models/Stone');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const SocialHandle = require('../models/SocialHandle');
const Contact = require('../models/Contact');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Collection = require('../models/Collection');
const logger = require('../utils/logger');
const seedUsers = require('./users');
const seedCategories = require('./categories');
const seedMetals = require('./metals');
const seedStones = require('./stones');
const seedProducts = require('./products');
const seedCarts = require('./carts');
const seedSocialHandles = require('./socialHandles');
const seedContacts = require('./contacts');
const seedReviews = require('./reviews');
const seedFavorites = require('./favorites');
const seedCollections = require('./collections');

const seedData = async () => {
  try {
    logger.info('Connecting to database...');
    await connectDB();
    logger.info('Database connected successfully');

    logger.info('Clearing existing data...');
    await Cart.deleteMany({});
    await Favorite.deleteMany({});
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Stone.deleteMany({});
    await Metal.deleteMany({});
    await Category.deleteMany({});
    await SocialHandle.deleteMany({});
    await Contact.deleteMany({});
    await Review.deleteMany({});
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
    const stones = await seedStones(categories);
    logger.info(`Stones seeded successfully: ${stones.length} stones created`);

    logger.info('Seeding products...');
    const products = await seedProducts(categories, metals, stones);
    logger.info(`Products seeded successfully: ${products.length} products created`);

    logger.info('Seeding carts...');
    const carts = await seedCarts(users, products, metals, stones);
    logger.info(`Carts seeded successfully: ${carts.length} carts created`);

    logger.info('Seeding social handles...');
    const socialHandles = await seedSocialHandles();
    logger.info(`Social handles seeded successfully: ${socialHandles.length} social handles created`);

    logger.info('Seeding contacts...');
    const contacts = await seedContacts();
    logger.info(`Contacts seeded successfully: ${contacts.length} contacts created`);

    logger.info('Seeding reviews...');
    const reviews = await seedReviews();
    logger.info(`Reviews seeded successfully: ${reviews.length} reviews created`);

    logger.info('Seeding favorites...');
    const favorites = await seedFavorites(users, products);
    logger.info(`Favorites seeded successfully: ${favorites.length} favorites created`);

    logger.info('Seeding collections...');
    const collections = await seedCollections();
    logger.info(`Collections seeded successfully: ${collections.length} collections created`);

    logger.info('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
