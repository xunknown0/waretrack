const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer
const { asyncErrorHandler } = require('../middleware/errorHandler');
const {
  productIndex, productNew, productCreate,
  productShow, productEdit, productUpdate, productDelete
} = require('../controllers/productController');

// Routes
router.get('/', asyncErrorHandler(productIndex));
router.get('/new', asyncErrorHandler(productNew));
router.post('/', upload.single('image'), asyncErrorHandler(productCreate));
router.get('/:id', asyncErrorHandler(productShow));
router.get('/:id/edit', asyncErrorHandler(productEdit));
router.put('/:id', upload.single('image'), asyncErrorHandler(productUpdate));
router.delete('/:id', asyncErrorHandler(productDelete));

module.exports = router;
