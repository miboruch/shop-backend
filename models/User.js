const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
