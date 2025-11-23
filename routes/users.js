const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

// --------------------
// Public routes
// --------------------

// Seed superadmin (run once)
router.get('/seed', userController.seedSuperAdmin);

// Login / Logout
router.get('/login', userController.showLoginForm);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logout);

// --------------------
// Superadmin routes
// --------------------

// Show register superadmin form
router.get(
  '/superadmin/register',
  isAuthenticated,
  authorizeRoles('superadmin'),
  userController.showSuperadminForm
);

// Register superadmin
router.post(
  '/superadmin/register',
  isAuthenticated,
  authorizeRoles('superadmin'),
  userController.registerSuperadmin
);

// --------------------
// Admin/Superadmin routes
// --------------------

// List users
router.get(
  '/users',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  userController.listUser
);

// Show create user form
router.get(
  '/users/create',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  userController.showCreateForm
);

// Register normal user
router.post(
  '/users/create',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  userController.userRegister
);

// --------------------
// Superadmin-only user management
// --------------------

// Edit user
router.get(
  '/users/:id/edit',
  isAuthenticated,
  authorizeRoles('superadmin'),
  userController.editUserForm
);

// Update user
router.post(
  '/users/:id/edit',
  isAuthenticated,
  authorizeRoles('superadmin'),
  userController.updateUser
);

// Delete user
router.post(
  '/users/:id/delete',
  isAuthenticated,
  authorizeRoles('superadmin'),
  userController.deleteUser
);

module.exports = router;
