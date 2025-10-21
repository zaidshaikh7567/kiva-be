const Product = require('../models/Product');

const seedProducts = async (categories, metals, stones) => {
  await Product.deleteMany({});

  const productsData = [
    {
      title: 'Diamond Engagement Ring',
      description: {
        material: '18K Yellow Gold',
        gemstone: 'Diamond',
        weight: '2.5 carats'
      },
      subDescription: 'Beautiful diamond ring perfect for engagements',
      price: 2500,
      quantity: 10,
      category: categories[0]._id,
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center'
      ],
      metals: [metals[0]._id],
      stoneType: stones[0]._id
    },
    {
      title: 'Pearl Necklace',
      description: {
        material: 'Sterling Silver',
        gemstone: 'Freshwater Pearls',
        length: '18 inches'
      },
      subDescription: 'Elegant pearl necklace for everyday wear',
      price: 150,
      quantity: 25,
      category: categories[1]._id,
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
      ],
      metals: [metals[1]._id]
    },
    {
      title: 'Gold Bracelet',
      description: {
        material: '14K Yellow Gold',
        style: 'Chain',
        width: '6mm'
      },
      subDescription: 'Classic gold bracelet',
      price: 800,
      quantity: 15,
      category: categories[2]._id,
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'
      ],
      metals: [metals[0]._id]
    },
    {
      title: 'Diamond Stud Earrings',
      description: {
        material: 'Platinum',
        gemstone: 'Diamond',
        size: '1 carat each'
      },
      subDescription: 'Timeless diamond stud earrings',
      price: 1200,
      quantity: 20,
      category: categories[3]._id,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'
      ],
      metals: [metals[2]._id],
      stoneType: stones[0]._id
    }
  ];

  const products = await Product.insertMany(productsData);
  console.log('Products seeded');
  return products;
};

module.exports = seedProducts;
