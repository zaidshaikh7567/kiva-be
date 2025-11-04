const mongoose = require('mongoose');

const metalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  purityLevels: [{
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
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Metal', metalSchema);
