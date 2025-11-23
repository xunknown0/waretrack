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
router.get('/superadmin/register', userController.showSuperadminForm);
router.post('/superadmin/register', userController.registerSuperadmin);

// User management (Admin/Superadmin)
router.get('/users', isAuthenticated, authorizeRoles('admin','superadmin'), userController.listUser);
router.get('/users/create', isAuthenticated, authorizeRoles('superadmin'), userController.showCreateForm);
router.post('/users/create', isAuthenticated, authorizeRoles('superadmin'), userController.userRegister);
router.get('/users/:id/edit', isAuthenticated, authorizeRoles('superadmin'), userController.editUserForm);
router.post('/users/:id/edit', isAuthenticated, authorizeRoles('superadmin'), userController.updateUser);
router.post('/users/:id/delete', isAuthenticated, authorizeRoles('superadmin'), userController.deleteUser);

module.exports = router;
