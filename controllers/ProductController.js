const Product = require('../models/Product').Product;
const socket = require('../socket');

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
      price: req.body.price,
      image: req.file.location
    });

    try {
      const addedProduct = await newProduct.save();

      socket.getIO().emit('productAdded', {addedProduct: addedProduct});

      res.status(200).send(addedProduct);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  removeProduct: async (req, res) => {
    const removedProduct = await Product.findOneAndDelete({
      $and: [{ _id: req.body.id }, { userID: req.user._id }]
    });

    if (!removedProduct) {
      res.status(400).send('Could not delete');
    } else {
      res.status(200).send('Deleted product successfully');

      socket.getIO().emit('productRemoved', { removedProduct: removedProduct });
    }
  },
  getSpecificProduct: async (req, res) => {
    const foundProduct = await Product.findOne({ _id: req.params.id });

    if (!foundProduct) {
      res.status(404).send('Product not found');
    }

    res.status(200).send(foundProduct);
  }
};

module.exports = product;
