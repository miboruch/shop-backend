const Product = require('../models/Product').Product;
const User = require('../models/User');
const socket = require('../socket');

const product = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getAllUserProducts: async (req, res) => {
    try {
      const userProducts = await Product.find({ userID: req.user._id });
      res.status(200).send(userProducts);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getAllCategoryProducts: async (req, res) => {
    /* '/product/getAllCategoryProducts/:category?page=1' */
    try {
      const allCategoryProducts = await Product.find({
        category: req.params.category
      });

      res.send(allCategoryProducts);
    } catch (e) {
      res.status(400).send(`Error ${e}`);
    }
  },
  addProduct: async (req, res) => {
    const userLogin = await User.findOne({ _id: req.user._id });

    const newProduct = new Product({
      userID: req.user._id,
      userLogin: userLogin.login,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.location
    });

    try {
      const addedProduct = await newProduct.save();

      socket.getIO().emit('productAdded', { addedProduct: addedProduct });

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

      socket.getIO().emit('productRemoved', { removedProductId: removedProduct._id });
    }
  },
  getSpecificProduct: async (req, res) => {
    const foundProduct = await Product.findOne({ _id: req.params.id });

    if (!foundProduct) {
      res.status(404).send('Product not found');
    }

    res.status(200).send(foundProduct);
  },
  getSearchedProducts: async (req, res) => {
    const query = req.params.query.split('_').join(' ');
    const products = await Product.find({ name: {$regex: `.*${query}.*`} });

    if (!products) {
      res.status(404).send('Products not found');
    }
    res.status(200).send(products);
  }
};

module.exports = product;
