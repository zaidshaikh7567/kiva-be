const Cart = require('../models/Cart');

const seedCarts = async (users, products, metals, stones) => {
  const carts = [];

  const sampleCarts = [
    {
      user: users[0]._id,
      product: products[0]._id,
      metal: metals[0]._id,
      purityLevel: metals[0].purityLevels[0],
      stoneType: stones[0]._id,
      quantity: 1
    },
    {
      user: users[1]._id,
      product: products[1]._id,
      metal: metals[1]._id,
      purityLevel: metals[1].purityLevels[0],
      quantity: 2
    },
    {
      user: users[0]._id,
      product: products[2]._id,
      metal: metals[0]._id,
      purityLevel: metals[0].purityLevels[1],
      stoneType: stones[1]._id,
      quantity: 1
    }
  ];

  for (const cartData of sampleCarts) {
    const cart = new Cart(cartData);
    await cart.save();
    carts.push(cart);
  }

  return carts;
};

module.exports = seedCarts;
