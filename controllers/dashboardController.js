// controllers/dashboardController.js
const Product = require("../models/productModel");
const User = require("../models/userModel");

module.exports = {
  async displayDashboard(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const search = req.query.q || "";

      const searchFilter = search
        ? { title: { $regex: search, $options: "i" } }
        : {};

      const totalProducts = await Product.countDocuments(searchFilter);
      const totalUsers = await User.countDocuments();
      const totalSales = 0;
      const totalStockAgg = await Product.aggregate([
        { $group: { _id: null, total: { $sum: "$stock" } } },
      ]);
      const totalStock = totalStockAgg[0]?.total || 0;

      const products = await Product.find(searchFilter)
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
        search,
        flash: req.flash(),
      });
    } catch (err) {
      next(err);
    }
  },
};
