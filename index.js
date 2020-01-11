const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socket = require('./socket');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

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

const connection = mongoose.connection;
connection.on('error', err => {
  console.log('Connection error', +err);
});
connection.once('open', () => {
  console.log('Connected with database');
  const server = app.listen(process.env.PORT || 3000, () => console.log('Server is up'));
  const io = socket.init(server);
  io.on('connection', socket => {
    console.log('User connected');
    io.on('disconnect', () => {
      console.log('User had left');
    });
  });
  app.use('/user', authRoutes);
  app.use('/product', productRoutes);
});
