const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {
  productDisplay,
  productNew,
  productCreate,
  productShow,
  productEdit,
  productUpdate,
  productDelete,
} = require("../controllers/productController");

// Display all products
router.get("/", asyncErrorHandler(productDisplay));
// Show form for new product
router.get("/new", asyncErrorHandler(productNew));

// Create product
router.post("/", upload.single("image"), asyncErrorHandler(productCreate));

// Show single product
router.get("/:id", asyncErrorHandler(productShow));

// Show edit form
router.get("/:id/edit", asyncErrorHandler(productEdit));

// Update product
router.put("/:id", upload.single("image"), asyncErrorHandler(productUpdate));

// Delete product
router.delete("/:id", asyncErrorHandler(productDelete));

module.exports = router;
