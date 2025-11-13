const Product = require("../models/productModel"); // adjust path if needed

module.exports = {
  //Get Display All Products
  async productIndex(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const totalProducts = await Product.countDocuments({});
      const products = await Product.find({}).skip(skip).limit(limit);

      const totalPages = Math.ceil(totalProducts / limit);

      res.render("products/index", {
        products,
        title: "Product Inventory",
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      next(err);
    }
  },
  //Get New Product (Create);
  async productNew(req, res, next) {
    res.render("products/new", {
      title: "Add New Product",
      errors: null,
      product: {},
    });
  },

  async productCreate(req, res, next) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.redirect("/products");
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.render("products/new", {
          title: "Add New Product",
          errors: err.errors,
          product: req.body,
        });
      }
      next(err);
    }
  },
  async productShow(req, res, next) {
  try {
    const { id } = req.params; // MongoDB ObjectId
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("products/show", { product });
  } catch (err) {
    next(err);
  }
}

};
