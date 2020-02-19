const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socket = require('./socket');
require('dotenv').config();
const Product = require('./models/Product').Product;

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, auth-token'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

let timeout;

const connection = mongoose.connection;
connection.on('error', err => {
  console.log('Connection error', +err);
});
connection.once('open', () => {
  console.log('Connected with database');
  const server = app.listen(process.env.PORT || 8000, () =>
    console.log('Server is up')
  );
  const io = socket.init(server);
  io.on('connection', socket => {
    socket.on('productReservation', async ({ productId }) => {
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: productId },
          { reserved: true },
          { returnNewDocument: true, useFindAndModify: false }
        );

        io.sockets.emit('productReserved', { updatedProduct });

        if (updatedProduct) {
          timeout = setTimeout(async () => {
            if (!updatedProduct) {
              throw new Error('Product does not exists anymore');
            } else {
              const expiredProduct = await Product.findOneAndUpdate(
                { _id: productId },
                { reserved: false },
                { returnNewDocument: true, useFindAndModify: false }
              );
              io.sockets.emit('productTimeout', { expiredProduct });
            }
          }, 15 * 60 * 1000);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('productDeleteReservation', async ({ productId }) => {
      clearTimeout(timeout);
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: productId },
          { reserved: false },
          { returnNewDocument: true }
        );
        io.sockets.emit('productUnreserved', { updatedProduct });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('resetCart', ({ cart }) => {
      try {
        cart.map(async item => {
          await Product.findOneAndUpdate(
            { _id: item._id },
            { reserved: false },
            { returnNewDocument: true }
          );
          io.sockets.emit('resetCartFinish', { cart });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
  app.use('/user', authRoutes);
  app.use('/product', productRoutes);
  app.use('/order', orderRoutes);
});
