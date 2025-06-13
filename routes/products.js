const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

router.get('/', productsController.getAll);
router.get('/:id', productsController.getSingle);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router; 