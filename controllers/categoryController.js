const Category = require("../models/categoryModel"); // Make sure this exists
const mongoose = require("mongoose");

module.exports = {
  // Display all categories
  async categoryDisplay(req, res, next) {
    try {
      const categories = await Category.find().sort({ name: 1 });

      // Build a nested category tree
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat._id] = { ...cat._doc, children: [] };
      });

      const nestedCategories = [];
      categories.forEach(cat => {
        if (cat.parent && categoryMap[cat.parent]) {
          categoryMap[cat.parent].children.push(categoryMap[cat._id]);
        } else {
          nestedCategories.push(categoryMap[cat._id]);
        }
      });

      res.render("categories/index", {
        categories: nestedCategories,
        title: "Categories"
      });
    } catch (err) {
      next(err);
    }
  },

  // Create a new category
  async categoryCreate(req, res, next) {
    try {
      const { name, parent } = req.body;
      if (!name || !name.trim()) return res.status(400).send("Category name is required");

      const category = new Category({
        name: name.trim(),
        parent: parent || null
      });

      await category.save();
      res.redirect("/categories");
    } catch (err) {
      next(err);
    }
  },

  // Delete category
  async categoryDelete(req, res, next) {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid category ID");

      // Optionally: check if category has children or products before deleting
      await Category.findByIdAndDelete(id);
      res.redirect("/categories");
    } catch (err) {
      next(err);
    }
  }
};
