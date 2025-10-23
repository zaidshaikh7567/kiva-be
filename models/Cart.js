const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  metal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Metal',
    required: true
  },
  purityLevel: {
    karat: {
      type: Number,
      required: true,
      min: 0
    },
    priceMultiplier: {
      type: Number,
      required: true,
      min: 0
    }
  },
  stoneType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stone'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
