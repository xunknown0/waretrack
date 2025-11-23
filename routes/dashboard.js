// routes/dashboard.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, dashboardController.displayDashboard);

module.exports = router;
