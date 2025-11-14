const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware/errorHandler');
const {
  productIndex,
  productNew,
  productCreate,
  productShow,
  productEdit,
  productUpdate,
  productDelete,
} = require('../controllers/productController');

/* GET products Index. */
router.get("/", asyncErrorHandler(productIndex));

/*GET products New */
router.get("/new",asyncErrorHandler(productNew) );

/*POST products Create */
router.post("/", asyncErrorHandler(productCreate));

/*GET products Show */

router.get('/:id', asyncErrorHandler(productShow));

/*GET products Edit */
router.get("/:id/edit", asyncErrorHandler(productEdit));

/*PUT products Update */
router.put("/:id", asyncErrorHandler(productUpdate));

/*Delete products Destroy */
router.delete("/:id", asyncErrorHandler(productDelete));


module.exports = router;
