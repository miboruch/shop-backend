const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const user = new User({
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
