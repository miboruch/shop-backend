const bcrypt = require('bcryptjs');
const socket = require('../socket');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  registerValidation,
  loginValidation
} = require('../utils/accountValidationSchema');

const user = {
  userRegister: async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(422).send(`Problem with data validation: ${error}`);
    }

    const isAlreadyCreated = await User.findOne({ email: req.body.email });
    const isLoginInDatabase = await User.findOne({ login: req.body.login });
    if (isAlreadyCreated || isLoginInDatabase) {
      return res
        .status(409)
        .send('Account with this email or login already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      login: req.body.login,
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      lastName: req.body.lastName,
      city: req.body.city,
      address: req.body.address
    });

    try {
      const savedUser = await user.save();
      const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
      console.log(savedUser);
      res.status(201).send({ ...savedUser, token: token });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  userLogin: async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(422).send(`Problem with user login: ${error}`);
    }

    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user)
      return res.status(400).send('Account with this email does not exists');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    socket.getIO().emit('userLogged', { token });
    res.header('auth-token', token).send({ token: token, id: user._id });
  },
  userLogout: (req, res) => {
    res.removeHeader('auth-token');
    res.send('User logout');
  },
  userUpdate: async (req, res) => {
    const { _id } = req.user;

    const updatedUser = await User.updateOne(
      { _id: _id },
      {
        name: req.body.name,
        lastName: req.body.lastName,
        city: req.body.city,
        address: req.body.address
      }
    );
    if (!updatedUser) {
      return res.status(404).send('Could not update');
    }
    console.log('Modified: ' + updatedUser.n);
    res.status(200).send('Updated');
  },
  getUserInfo: async (req, res) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  }
};

module.exports = user;
