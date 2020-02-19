const mongoose = require('mongoose');

const PRODUCT_CATEGORY = ['electronics', 'fashion', 'others'];

const productSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
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
  },
  reserved: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  productSchema: productSchema
};
