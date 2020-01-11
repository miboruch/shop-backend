const router = require('express').Router();
const user = require('../controllers/UserController');
const privateRoute = require('../middlewares/private');

router.post('/register', user.userRegister);
router.post('/login', user.userLogin);
router.post('/logout', user.userLogout);
router.put('/update', privateRoute, user.userUpdate);
router.get('/information', privateRoute, user.getUserInfo);

module.exports = router;
