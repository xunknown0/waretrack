const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const User = require("../models/userModel"); // ✅ Add this

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments(); // ✅ Calculate total users
    const totalSales = 0; // Replace with your sales logic
    const totalStockAgg = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    const totalStock = totalStockAgg[0]?.total || 0;

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ title: 1 })
      .populate("category");

    const totalPages = Math.ceil(totalProducts / limit);

    res.render("dashboard", {
      products,
      totalProducts,
      totalUsers,
      totalSales,
      totalStock,
      currentPage: page,
      totalPages,
      currentUserRole: req.session.userRole,
      currentPath: req.path,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
