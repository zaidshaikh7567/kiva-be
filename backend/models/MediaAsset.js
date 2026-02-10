const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
    page: {
      type: String,
      enum: ['home', 'contact', 'about', 'favorites', 'custom','ring', 'bracelet', 'earring', 'necklace', 'other'],
      default: 'other',
    },
    section: {
      type: String,
      trim: true,
    },
    key: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

mediaAssetSchema.index({ page: 1, section: 1, key: 1 });

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);


