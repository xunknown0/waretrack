const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware/errorHander');
const {
  productIndex,
  productNew,
  productCreate,
  productShow,
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
router.get("/products/:id/edit", (req, res, next) => {
  res.send("/products/:id/edit");
});

/*PUT products Update */
router.put("/products/:id", (req, res, next) => {
  res.send("/products/:id");
});

/*Delete products Destroy */
router.delete("/products/:id", (req, res, next) => {
  res.send("/products/:id");
});


module.exports = router;
