const Order = require('../models/Order');
const User = require('../models/User');
const socket = require('../socket');
const Product = require('../models/Product').Product;

const order = {
  createOrder: async (req, res) => {
    const orderStaticData = {
      cart: req.body.cart,
      totalPrice: req.body.totalPrice
    };

    if (req.body.userID) {
      const user = await User.findOne({ _id: req.body.userID });

      if (!user) {
        res.status(400).send('User with this ID was not found');
      } else {
        const order = new Order({
          ...orderStaticData,
          userID: req.body.userID,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          address: req.body.address,
          city: req.body.city,
          country: req.body.country
        });
        try {
          const newOrder = await order.save();
          req.body.cart.map(async item => {
            await Product.findOneAndDelete({
              _id: item._id
            });
          });

          socket
            .getIO()
            .emit('productOrdered', { orderedProduct: req.body.cart });

          res.status(200).send(`New order created ${newOrder}`);
        } catch (e) {
          res.status(400).send(`Could not create a new order ${e}`);
        }
      }
    } else {
      const order = new Order({
        ...orderStaticData,
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country
      });

      try {
        const newOrder = await order.save();
        req.body.cart.map(async item => {
          await Product.findOneAndDelete({
            _id: item._id
          });
        });
        socket
          .getIO()
          .emit('productOrdered', { orderedProduct: req.body.cart });

        res.status(200).send(`New order created ${newOrder}`);
      } catch (e) {
        res.send(400).send('Could not create a new order');
      }
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const userOrders = await Order.find({ userID: req.user._id });
      res.status(200).send({
        orders: userOrders
      });
    } catch (error) {
      res.status(404).send(`Not found ${error}`);
    }
  }
};

module.exports = order;
