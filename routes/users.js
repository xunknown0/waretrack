const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

// Seed superadmin (run once)
router.get('/seed', userController.seedSuperAdmin);

// Login
router.get('/login', userController.showLoginForm);
router.post('/login', userController.loginUser);

// Show registration form
router.get('/users/register', userController.showCreateForm);

// Handle registration (form POST)
router.post('/users/register', userController.userRegister);

// Logout
router.get('/logout', userController.logout);

// User management (Admin/Superadmin)
router.get('/users', isAuthenticated, authorizeRoles('admin', 'superadmin'), userController.listUser);
router.get('/users/create', isAuthenticated, authorizeRoles('superadmin'), userController.showCreateForm);
router.post('/users/create', isAuthenticated, authorizeRoles('superadmin'), userController.userRegister);

module.exports = router;
