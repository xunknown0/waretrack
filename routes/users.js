const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

// Seed superadmin (run once)
router.get('/seed', userController.seedSuperAdmin);

// Login/logout
router.get('/login', userController.showLoginForm);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);

// Superadmin registration
router.get('/superadmin/register', isAuthenticated, authorizeRoles('superadmin'), userController.showSuperadminForm);
router.post('/superadmin/register', isAuthenticated, authorizeRoles('superadmin'), userController.registerSuperadmin);

// User management (Admin/Superadmin)
router.get('/users', isAuthenticated, authorizeRoles('admin','superadmin'), userController.listUser);

// Admin & Superadmin can create normal users
router.get('/users/create', isAuthenticated, authorizeRoles('admin','superadmin'), userController.showCreateForm);
router.post('/users/create', isAuthenticated, authorizeRoles('admin','superadmin'), userController.userRegister);

// Only Superadmin can edit/delete users
router.get('/users/:id/edit', isAuthenticated, authorizeRoles('superadmin'), userController.editUserForm);
router.post('/users/:id/edit', isAuthenticated, authorizeRoles('superadmin'), userController.updateUser);
router.post('/users/:id/delete', isAuthenticated, authorizeRoles('superadmin'), userController.deleteUser);

module.exports = router;
