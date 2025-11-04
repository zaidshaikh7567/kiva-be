const SocialHandle = require('../models/SocialHandle');
const logger = require('../utils/logger');

const socialHandlesData = [
  {
    platform: 'Facebook',
    url: 'https://www.facebook.com/kivadiamond',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    isActive: true
  },
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/kivadiamond',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop',
    isActive: true
  },
  {
    platform: 'Twitter',
    url: 'https://www.twitter.com/kivadiamond',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    isActive: true
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/company/kivadiamond',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    isActive: true
  },
  {
    platform: 'Pinterest',
    url: 'https://www.pinterest.com/kivadiamond',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    isActive: false
  }
];

const seedSocialHandles = async () => {
  try {
    const socialHandles = await SocialHandle.insertMany(socialHandlesData);
    return socialHandles;
  } catch (error) {
    logger.error('Error seeding social handles:', error);
    throw error;
  }
};

module.exports = seedSocialHandles;

