const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.on('error', err => {
  console.log('Connection error', + err);
});
connection.once('open', () => {
  console.log('Connected with database');
  app.listen(3000, () => console.log('Server is up'));
  app.use('/user', authRoutes);
});
