const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

module.exports = {

  // Display all categories
async categoryDisplay(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // items per page
    const skip = (page - 1) * limit;

    // Fetch all categories (parents + children)
    const allCategories = await Category.find().sort({ createdAt: -1 });

    // Fetch only child categories for pagination
    const totalItems = await Category.countDocuments({ parent: { $ne: null } });
    const totalPages = Math.ceil(totalItems / limit);

    const childCategories = await Category.find({ parent: { $ne: null } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render('categories', {
      categories: allCategories, // used to populate parent dropdowns
      childCategories,
      pagination: {
        currentPage: page,
        totalPages
      }
    });
  } catch (err) {
    next(err);
  }
},
  // Create a new category (parent or child)
  async categoryCreate(req, res, next) {
    try {
      let { name, parent } = req.body;

      // Clean parent value
      if (!parent || parent === "null" || parent === "undefined" || parent.trim() === "") {
        parent = null;
      }

      await Category.create({ name, parent });

      req.flash("success", `Category "${name}" added successfully.`);
      res.redirect("/categories"); // reload the same page
    } catch (err) {
      console.error("Category creation error:", err);
      req.flash("error", "Failed to add category. Make sure parent is valid.");
      res.redirect("/categories");
    }
  },

  // Delete category recursively
  async categoryDelete(req, res, next) {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Invalid category ID");

      async function deleteCategoryTree(categoryId) {
        const children = await Category.find({ parent: categoryId });
        for (const child of children) {
          await deleteCategoryTree(child._id);
        }
        await Category.findByIdAndDelete(categoryId);
      }

      await deleteCategoryTree(id);

      req.flash("success", "Category and subcategories deleted successfully");
      res.redirect("/categories");
    } catch (err) {
      next(err);
    }
  }
};
