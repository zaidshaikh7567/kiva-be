const Order = require('../models/Order');

const seedOrders = async (users, carts) => {
  const orders = [];

  const sampleOrders = [
    {
      user: users[1]._id,
      items: [
        {
          product: carts[0].product,
          productName: 'Sample Product Title 1',
          productImage: 'https://example.com/image1.jpg',
          metal: carts[0].metal,
          metalName: 'Gold',
          purityLevel: carts[0].purityLevel,
          stoneType: carts[0].stoneType,
          stoneName: 'Diamond',
          stonePrice: 5000,
          ringSize: '7',
          quantity: carts[0].quantity,
          unitPrice: 1500,
          totalPrice: 6500
        }
      ],
      subtotal: 6500,
      total: 6500,
      status: 'delivered',
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      notes: 'Handle with care'
    },
    {
      user: users[2]._id,
      items: [
        {
          product: carts[1].product,
          productName: 'Sample Product 2',
          productImage: 'https://example.com/image2.jpg',
          metal: carts[1].metal,
          metalName: 'Platinum',
          purityLevel: carts[1].purityLevel,
          quantity: carts[1].quantity,
          unitPrice: 2000,
          totalPrice: 4000
        }
      ],
      subtotal: 4000,
      total: 4000,
      status: 'shipped',
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      paymentMethod: 'PayPal',
      notes: 'Gift wrapping requested'
    },
    {
      user: users[1]._id,
      items: [
        {
          product: carts[2].product,
          productName: 'Sample Product 3',
          productImage: 'https://example.com/image3.jpg',
          metal: carts[2].metal,
          metalName: 'Gold',
          purityLevel: carts[2].purityLevel,
          stoneType: carts[2].stoneType,
          stoneName: 'Ruby',
          stonePrice: 3000,
          quantity: carts[2].quantity,
          unitPrice: 1800,
          totalPrice: 4800
        }
      ],
      subtotal: 4800,
      total: 4800,
      status: 'processing',
      shippingAddress: {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      notes: 'Express delivery'
    },
    {
      user: users[3]._id,
      items: [
        {
          product: carts[0].product,
          productName: 'Sample Product 1',
          productImage: 'https://example.com/image1.jpg',
          metal: carts[0].metal,
          metalName: 'Gold',
          purityLevel: carts[0].purityLevel,
          stoneType: carts[0].stoneType,
          stoneName: 'Diamond',
          stonePrice: 5000,
          quantity: 1,
          unitPrice: 1500,
          totalPrice: 6500
        },
        {
          product: carts[1].product,
          productName: 'Sample Product 2',
          productImage: 'https://example.com/image2.jpg',
          metal: carts[1].metal,
          metalName: 'Platinum',
          purityLevel: carts[1].purityLevel,
          quantity: 1,
          unitPrice: 2000,
          totalPrice: 2000
        }
      ],
      subtotal: 8500,
      total: 8500,
      status: 'pending',
      shippingAddress: {
        street: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA'
      },
      billingAddress: {
        street: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA'
      },
      paymentMethod: 'Bank Transfer',
      notes: 'Please call before delivery'
    }
  ];

  for (const orderData of sampleOrders) {
    const order = new Order(orderData);
    await order.save();
    orders.push(order);
  }

  return orders;
};

module.exports = seedOrders;
