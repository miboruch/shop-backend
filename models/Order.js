const mongoose = require('mongoose');
const Product = require('../models/Product');

const userSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId
  },
  cart: {
    type: [Product],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    max: 255
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

module.exports = mongoose.model('User', userSchema);
