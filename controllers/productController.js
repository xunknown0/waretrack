const Product = require("../models/productModel");
const Category = require("../models/categoryModel"); // Make sure you have a Category model
const fs = require('fs');
const path = require('path');

module.exports = {

  // Display all products
  async productIndex(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const date = req.query.date || "";

      let query = {};

      // Search filter
      if(search){
        const keyword = search.toLowerCase();
        if(keyword === "low") query.stock = { $gt:0, $lt:20 };
        else if(keyword === "out") query.stock = 0;
        else if(keyword === "available") query.stock = { $gt:0 };
        else query.$or = [
          { title: { $regex: search, $options:"i" } },
          { description: { $regex: search, $options:"i" } }
        ];
      }

      // Date filter
      if(date){
        const start = new Date(date); start.setHours(0,0,0,0);
        const end = new Date(date); end.setHours(23,59,59,999);
        query.createdAt = { $gte: start, $lte: end };
      }

      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate('category') // dynamically populate category
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalProducts / limit);
      const categories = await Category.find(); // fetch all categories

      res.render("products/index", {
        products,
        categories,
        currentPage: page,
        totalPages,
        search,
        date,
        title: "Product Inventory"
      });

    } catch(err) {
      next(err);
    }
  },

  // Create product
  async productCreate(req, res, next){
    try {
      const { title, category, stock, price, description } = req.body;
      let image = null;

      // Store image in DB
      if(req.file){
        image = {
          data: fs.readFileSync(path.join(__dirname,'../public/uploads/'+req.file.filename)),
          contentType: req.file.mimetype
        };
      }

      const product = new Product({ title, category, stock, price, description, image });
      await product.save();
      res.redirect('/products');
    } catch(err){
      next(err);
    }
  },

  // Update product
  async productUpdate(req, res, next){
    try {
      const { title, category, stock, price, description } = req.body;
      let updateData = { title, category, stock, price, description };

      if(req.file){
        updateData.image = {
          data: fs.readFileSync(path.join(__dirname,'../public/uploads/'+req.file.filename)),
          contentType: req.file.mimetype
        };
      }

      await Product.findByIdAndUpdate(req.params.id, updateData, { new:true, runValidators:true });
      res.redirect('/products');
    } catch(err){
      next(err);
    }
  },

  // Delete product
  async productDelete(req,res,next){
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect('/products');
    } catch(err){
      next(err);
    }
  }

};
