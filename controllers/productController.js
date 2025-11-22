const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

module.exports = {
  // Display all products with nested categories, search, date, and pagination
async productDisplay(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const date = req.query.date || "";

    let query = {};

    // Search filter
    if (search) {
      const keyword = search.toLowerCase();
      if (keyword === "low") query.stock = { $gt: 0, $lt: 20 };
      else if (keyword === "out") query.stock = 0;
      else if (keyword === "available") query.stock = { $gt: 0 };
      else
        query.$or = [
        { sku: { $regex: search, $options: "i" } },
    { title: { $regex: search, $options: "i" } },
        ];
    }

    // Date filter
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    // Fetch products with category and parent populated
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate({
        path: "category",
        populate: { path: "parent" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch all categories for dropdown
    const categories = await Category.find().lean();

    // Build map and nested structure for dropdown
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = cat;
    });

    const nestedCategories = [];
    categories.forEach((cat) => {
      if (cat.parent && categoryMap[cat.parent]) {
        if (!categoryMap[cat.parent].children) categoryMap[cat.parent].children = [];
        categoryMap[cat.parent].children.push(cat);
      } else {
        nestedCategories.push(cat);
      }
    });

    // Only show child category name
   products.forEach((prod) => {
  if (prod.category) {
    if (prod.category.parent && prod.category.parent.name) {
      prod.categoryName = prod.category.parent.name + " > " + prod.category.name;
    } else {
      prod.categoryName = prod.category.name;
    }
  } else {
    prod.categoryName = "-";
  }
});


    res.render("products/index", {
      products,
      categories: nestedCategories,
      currentPage: page,
      totalPages,
      search,
      date,
      title: "Product Inventory",
    });
  } catch (err) {
    next(err);
  }
},

  // Create product with strong duplication check
async productCreate(req, res, next) {
  try {
    let { title, stock, price, description, category } = req.body;

    // Normalize inputs
    title = title.trim().replace(/\s+/g, " ");
    title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter
    description = description.trim().replace(/\s+/g, " ");
    price = parseFloat(price);
    stock = parseInt(stock) || 0;

    // Validate price & stock
    if (isNaN(price) || price < 0) {
      req.flash('error', 'Invalid price');
      return res.redirect('/products');
    }
    if (isNaN(stock) || stock < 0) {
      req.flash('error', 'Invalid stock');
      return res.redirect('/products');
    }

    // Restrict forbidden characters in title
    const forbiddenChars = /["'<>;]/;
    if (forbiddenChars.test(title)) {
      req.flash('error', 'Product title cannot contain special characters: ", \', <, >, ;.');
      return res.redirect('/products');
    }

    // Handle image upload
    let image = null;
    let imageHash = null;
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads/" + req.file.filename
      );
      const imageBuffer = fs.readFileSync(imagePath);

      imageHash = crypto.createHash("md5").update(imageBuffer).digest("hex");

      image = {
        data: imageBuffer,
        contentType: req.file.mimetype,
      };
    }

    // Strong duplication check
    const existingProduct = await Product.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
      price,
      description,
      ...(imageHash ? { imageHash } : {}),
    });

    if (existingProduct) {
      req.flash('error', 'Product already exists.');
      return res.redirect('/products');
    }

    
    // Create product
    const product = new Product({
      title,
      stock,
      price,
      description,
      category: category || null,
      image,
      imageHash,
    });

    await product.save();
    req.flash('success', 'Product Added Successfully!');
    res.redirect("/products");

  } catch (err) {
    next(err);
  }
},


  // Update product with same duplication prevention
 async productUpdate(req, res, next) {
  try {
    const { id } = req.params;
    let { title, stock, price, description, category } = req.body;

    // Normalize inputs
    title = title.trim().replace(/\s+/g, " ");
    title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter
    description = description.trim().replace(/\s+/g, " ");
    price = parseFloat(price);
    stock = parseInt(stock) || 0;

    // Validate price & stock
    if (isNaN(price) || price < 0) {
      req.flash('error', 'Invalid price');
      return res.redirect('/products');
    }
    if (isNaN(stock) || stock < 0) {
      req.flash('error', 'Invalid stock');
      return res.redirect('/products');
    }

    // Restrict forbidden characters
    const forbiddenChars = /["'<>;]/;
    if (forbiddenChars.test(title)) {
      req.flash('error', 'Product title cannot contain special characters: ", \', <, >, ;.');
      return res.redirect('/products');
    }

    // Restrict specific titles
    if (title.toLowerCase() === "usb-c cable") {
      req.flash('error', "Updating to 'USB-C Cable' is not allowed.");
      return res.redirect('/products');
    }

    // Handle image upload if exists
    let image = null;
    let imageHash = null;
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads/" + req.file.filename
      );
      const imageBuffer = fs.readFileSync(imagePath);

      imageHash = crypto.createHash("md5").update(imageBuffer).digest("hex");

      image = {
        data: imageBuffer,
        contentType: req.file.mimetype,
      };
    }

    // Strong duplication check (excluding the current product)
    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      title: { $regex: `^${title}$`, $options: "i" },
      price,
      description,
      ...(imageHash ? { imageHash } : {}),
    });

    if (existingProduct) {
      req.flash('error', 'Another product with same details already exists.');
      return res.redirect('/products');
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        stock,
        price,
        description,
        category: category || null,
        ...(image ? { image, imageHash } : {}),
      },
      { new: true }
    );

    req.flash('success', 'Product Updated Successfully!');
    res.redirect('/products');

  } catch (err) {
    next(err);
  }
},


  // Delete product
  async productDelete(req, res, next) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      req.flash('success', 'Product Deleted Successfully!');
      res.redirect("/products");

    } catch (err) {
      next(err);
    }
  },
};