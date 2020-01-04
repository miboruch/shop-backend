const Product = require('../models/Product');

const product = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).send({
        count: products.length,
        products: products
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getAllUserProducts: async (req, res) => {
    try {
      const userProducts = await Product.find({ userID: req.user._id });
      res.status(200).send({
        count: userProducts.length,
        products: userProducts
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  addProduct: async (req, res) => {
    const newProduct = new Product({
      userID: req.user._id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });

    try {
      const savedProduct = await newProduct.save();
      const updatedAllProducts = await Product.find();
      console.log(updatedAllProducts);

      res.status(200).send(savedProduct);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

module.exports = product;
