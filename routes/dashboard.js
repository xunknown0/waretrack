const express = require('express');
const router = express.Router();
const Product = require('../models/productModel'); // your Product model

// Dashboard route (also homepage)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const totalProducts = await Product.countDocuments();
    const totalSales = 0; // Replace with real sales
    const totalStockAgg = await Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]);
    const totalStock = totalStockAgg[0]?.total || 0;

    // Fetch products with category populated
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ title: 1 })
      .populate('category'); // <-- important

    const totalPages = Math.ceil(totalProducts / limit);

    res.render('dashboard', {
      products,
      totalProducts,
      totalSales,
      totalStock,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
