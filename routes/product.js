const router = require('express').Router();
const product = require('../controllers/ProductController');
const privateRoute = require('../middlewares/private');
const upload = require('../services/imageUpload');

router.get('/getAll', product.getAllProducts);
router.get('/getUserProducts', privateRoute, product.getAllUserProducts);
router.post('/addProduct', privateRoute, upload.single('image'), product.addProduct);
router.post('/removeProduct', privateRoute, product.removeProduct);
router.get('/getSpecificProduct/:id', product.getSpecificProduct);
router.get('/getAllCategoryProducts/:category', product.getAllCategoryProducts);

module.exports = router;
