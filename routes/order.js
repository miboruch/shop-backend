const router = require('express').Router();
const order = require('../controllers/OrderController');
const privateRoute = require('../middlewares/private');

router.get('/getUserOrders', privateRoute, order.getUserOrders);
router.post('/createOrder', order.createOrder);

module.exports = router;
