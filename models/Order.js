const mongoose = require('mongoose');
const productSchema = require('../models/Product').productSchema;

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId
  },
  cart: {
    type: [productSchema],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    max: 255,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
