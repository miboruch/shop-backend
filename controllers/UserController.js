const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../utils/validationSchema');

const user = {
  userRegister: async (req, res) => {

    const {error} = registerValidation(req.body);
    if(error) {return res.status(422).send(`Problem with data validation: ${error}`)}

    const isAlreadyCreated = await User.findOne({ email: req.body.email });
    if (isAlreadyCreated)
      return res.status(400).send('Account with this email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      login: req.body.login,
      email: req.body.email,
      password: hashedPassword
    });

    try {
      const savedUser = await user.save();
      console.log(savedUser);
      res.status(201).send(savedUser);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

module.exports = user;
