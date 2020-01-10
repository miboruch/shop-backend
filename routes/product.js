const router = require('express').Router();
const product = require('../controllers/ProductController');
const privateRoute = require('./private');

router.get('/getAll', product.getAllProducts);
router.get('/getUserProducts', privateRoute, product.getAllUserProducts);
router.post('/addProduct', privateRoute, product.addProduct);
router.post('/removeProduct', privateRoute, product.removeProduct);
router.get('/getSpecificProduct/:id', product.getSpecificProduct);

module.exports = router;
