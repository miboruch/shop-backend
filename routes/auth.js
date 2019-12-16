const router = require('express').Router();
const user = require('../controllers/UserController');

router.post('/register', user.userRegister);

module.exports = router;
