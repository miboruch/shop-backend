const mongoose = require('mongoose');

const PRODUCT_CATEGORY = ['electronics', 'fashion', 'others'];

const productSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  userLogin: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: PRODUCT_CATEGORY,
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
