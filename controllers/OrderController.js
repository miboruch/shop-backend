const Order = require('../models/Order');
const User = require('../models/User');
const socket = require('../socket');

const order = {
  createOrder: async (req, res) => {
    const orderStaticData = {
      userID: req.body.userID,
      cart: req.body.cart,
      totalPrice: req.body.totalPrice
    };

    if (req.body.userID) {
      const user = await User.findOne({ _id: req.body.userID });

      if (!user) {
        res.status(404).send('User with this ID was not found');
      } else {
        const order = new Order({
          ...orderStaticData,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city
        });
        try {
          const newOrder = await order.save();
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
        city: req.body.city
      });

      try {
        const newOrder = await order.save();
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
