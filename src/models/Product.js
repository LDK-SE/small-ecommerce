const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\/.+/i
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      index: true
    },
    discount: {
      type: Number,
      min: 0,
      max: 99,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
