const Collection = require('../models/Collection');
const logger = require('../utils/logger');

const seedCollections = async () => {
  try {
    const collectionsData = [
      {
        title: 'Youth Collection',
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'
        ],
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        category: 'necklaces',
        isNew: true,
        isActive: true
      },
      {
        title: 'Classic Collection',
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
        ],
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        category: 'rings',
        isNew: false,
        isActive: true
      },
      {
        title: 'Luxury Collection',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'
        ],
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        category: 'bracelets',
        isNew: true,
        isActive: true
      },
      {
        title: 'Elegant Earrings',
        images: [],
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        category: 'earrings',
        isNew: false,
        isActive: false
      }
    ];

    const collections = await Collection.insertMany(collectionsData);
    return collections;
  } catch (error) {
    logger.error('Error seeding collections:', error);
    throw error;
  }
};

module.exports = seedCollections;
