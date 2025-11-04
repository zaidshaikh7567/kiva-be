const Favorite = require('../models/Favorite');
const logger = require('../utils/logger');

const seedFavorites = async (users, products) => {
  try {
    const favorites = [];

    // Create sample favorites - each user favorites some products
    const sampleFavorites = [
      {
        user: users[0]._id,
        product: products[0]._id
      },
      {
        user: users[0]._id,
        product: products[1]._id
      },
      {
        user: users[0]._id,
        product: products[2]._id
      },
      {
        user: users[1]._id,
        product: products[0]._id
      },
      {
        user: users[1]._id,
        product: products[3]._id
      },
      {
        user: users[2]._id,
        product: products[1]._id
      },
      {
        user: users[2]._id,
        product: products[2]._id
      },
      {
        user: users[2]._id,
        product: products[3]._id
      },
      {
        user: users[2]._id,
        product: products[3]._id
      },
      {
        user: users[3]._id,
        product: products[1]._id
      }
    ];

    for (const favoriteData of sampleFavorites) {
      // Check if favorite already exists (to avoid duplicate key errors)
      const existingFavorite = await Favorite.findOne({
        user: favoriteData.user,
        product: favoriteData.product
      });

      if (!existingFavorite && favoriteData.user && favoriteData.product) {
        const favorite = new Favorite(favoriteData);
        await favorite.save();
        favorites.push(favorite);
      }
    }

    return favorites;
  } catch (error) {
    logger.error('Error seeding favorites:', error);
    throw error;
  }
};

module.exports = seedFavorites;
