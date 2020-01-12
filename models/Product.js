const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  productSchema: productSchema
};
