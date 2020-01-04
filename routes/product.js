const router = require('express').Router();
const product = require('../controllers/ProductController');
const privateRoute = require('./private');

router.get('/getAll', product.getAllProducts);
router.get('/getUserProducts', privateRoute, product.getAllProducts);
router.post('/addProduct', privateRoute, product.addProduct);

module.exports = router;
