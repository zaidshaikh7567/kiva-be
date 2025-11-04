const Review = require('../models/Review');
const logger = require('../utils/logger');

const reviewsData = [
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    comment: 'Absolutely stunning jewelry! The quality is exceptional and the craftsmanship is outstanding. I received my order quickly and it was beautifully packaged.',
    rating: 5
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    comment: 'Great selection and excellent customer service. The diamond ring I purchased exceeded my expectations. Highly recommend!',
    rating: 5
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    comment: 'Beautiful pieces at reasonable prices. The necklace I bought looks even better in person than in the photos. Very satisfied with my purchase.',
    rating: 4
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    comment: 'The quality of the jewelry is impressive. Fast shipping and secure packaging. Will definitely shop here again for future gifts.',
    rating: 5
  },
  {
    name: 'Olivia Brown',
    email: 'olivia.brown@example.com',
    comment: 'I love my new bracelet! The design is elegant and it fits perfectly. The customer service team was very helpful with sizing questions.',
    rating: 5
  },
  {
    name: 'David Lee',
    email: 'david.lee@example.com',
    comment: 'Good quality jewelry, though the shipping took a bit longer than expected. Overall satisfied with the product.',
    rating: 4
  },
  {
    name: 'Isabella Garcia',
    email: 'isabella.garcia@example.com',
    comment: 'The earrings are gorgeous and the quality is excellent. The website photos accurately represent the products. Very happy with my purchase!',
    rating: 5
  },
  {
    name: 'William Taylor',
    email: 'william.taylor@example.com',
    comment: 'Purchased an engagement ring and my fiancée loved it! The ring is beautiful and the packaging was elegant. Great experience overall.',
    rating: 5
  },
  {
    name: 'Ava Anderson',
    email: 'ava.anderson@example.com',
    comment: 'Nice selection of jewelry. The pieces are well-made and the prices are fair. The return process was smooth when I needed to exchange a size.',
    rating: 4
  },
  {
    name: 'Benjamin Moore',
    email: 'benjamin.moore@example.com',
    comment: 'Excellent quality and great customer service. The ring I ordered was exactly as described. Fast shipping and secure packaging.',
    rating: 5
  },
  {
    name: 'Charlotte Davis',
    email: 'charlotte.davis@example.com',
    comment: 'Beautiful jewelry collection. I bought several pieces and all are of high quality. The website is easy to navigate and checkout was smooth.',
    rating: 5
  },
  {
    name: 'Lucas Johnson',
    email: 'lucas.johnson@example.com',
    comment: 'The jewelry is nice but I expected a bit more sparkle. Still, the quality is good for the price point. Satisfied customer.',
    rating: 3
  }
];

const seedReviews = async () => {
  try {
    const reviews = await Review.insertMany(reviewsData);
    return reviews;
  } catch (error) {
    logger.error('Error seeding reviews:', error);
    throw error;
  }
};

module.exports = seedReviews;

