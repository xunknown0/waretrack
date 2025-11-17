const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


module.exports = {
  // Display all products
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
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
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

      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalProducts / limit);

      res.render("products/index", {
        products,
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
      let { title, stock, price, description } = req.body;

      // Normalize inputs
      title = title.trim().replace(/\s+/g, " ").toLowerCase();
      description = description.trim().replace(/\s+/g, " ");
      price = parseFloat(price);

      let image = null;
      let imageHash = null;

      if (req.file) {
        const imagePath = path.join(__dirname, "../public/uploads/" + req.file.filename);
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
        price: price,
        description: description,
        ...(imageHash ? { imageHash } : {}),
      });

      if (existingProduct) {
        return res
          .status(400)
          .send("A product with the same title, price, description, and image already exists.");
      }

      const product = new Product({ title, stock, price, description, image, imageHash });
      await product.save();

      res.redirect("/products");
    } catch (err) {
      next(err);
    }
  },

  // Update product with same duplication prevention
  async productUpdate(req, res, next) {
    
     try {
    const { title, category, stock, price, description } = req.body;
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID");
    }

    const normalizedTitle = title.trim().replace(/\s+/g, " ").toLowerCase();
    const normalizedDescription = description.trim().replace(/\s+/g, " ");
    const numericPrice = parseFloat(price);

    let updateData = {
      title: normalizedTitle,
      stock: stock ? parseInt(stock) : 0,
      price: numericPrice,
      description: normalizedDescription,
    };

    if (category) updateData.category = category;

    let imageHash = null;
    if (req.file) {
      const imagePath = path.join(__dirname, "../public/uploads/" + req.file.filename);
      const imageBuffer = fs.readFileSync(imagePath);
      imageHash = crypto.createHash("md5").update(imageBuffer).digest("hex");

      updateData.image = {
        data: imageBuffer,
        contentType: req.file.mimetype,
      };
      updateData.imageHash = imageHash;
    }

    // Strong duplication check excluding current product
    const existingProduct = await Product.findOne({
      _id: { $ne: productId },
      title: { $regex: `^${normalizedTitle}$`, $options: "i" },
      price: numericPrice,
      description: normalizedDescription,
      ...(imageHash ? { imageHash } : {}),
    });

    if (existingProduct) {
      return res
        .status(400)
        .send("Another product with the same title, price, description, and image already exists.");
    }

    await Product.findByIdAndUpdate(productId, updateData, { new: true });

    res.redirect("/products");
  } catch (err) {
    next(err);
  }

  },

  // Delete product
  async productDelete(req, res, next) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect("/products");
    } catch (err) {
      next(err);
    }
  },
};
