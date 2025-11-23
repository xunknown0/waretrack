const User = require('../models/userModel');

// Async wrapper
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Seed superadmin (run once)
const seedSuperAdmin = catchAsync(async (req, res) => {
  const existing = await User.findOne({ role: 'superadmin' });
  if (!existing) {
    await new User({
      name: 'Mae',
      email: 'superadmin@example.com',
      password: 'qwerty12345',
      role: 'superadmin'
    }).save();
    console.log('Default superadmin created!');
  }
  res.send('Superadmin seeded successfully!');
});

// Show login form
const showLoginForm = (req, res) => {
  res.render('users/login'); // flash messages are in res.locals
};

// Login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/user/login'); 
  }

  req.session.userId = user._id;
  req.session.userRole = user.role;
  req.flash('success', `Welcome back, ${user.name || user.email}!`);
  res.redirect('/dashboard');
});

// Logout
const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/user/login'));
};

// Superadmin registration form
const showSuperadminForm = (req, res) => {
  res.render('users/superadminRegister', {
    error_msg: req.flash('error') || [],
    success_msg: req.flash('success') || []
  });
};

// Register superadmin
const registerSuperadmin = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    req.flash('error', 'Email already exists');
    return res.redirect('/user/superadmin/register');
  }
  await new User({ name, email, password, role: 'superadmin' }).save();
  req.flash('success', 'Superadmin registered successfully!');
  res.redirect('/user/login');
});

// List users (Admin/Superadmin)
const listUser = catchAsync(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.render('users/list', { users });
});

// Show create user form (Superadmin)
const showCreateForm = (req, res) => {
  res.render('users/userCreate');
};

// Register normal user
const userRegister = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    req.flash('error', 'Email already exists');
    return res.redirect('/user/users/create');
  }

  let assignedRole = role || 'staff';
  if (assignedRole !== 'staff' && req.session.userRole !== 'superadmin') {
    assignedRole = 'staff';
  }

  await new User({ name, email, password, role: assignedRole }).save();
  req.flash('success', 'User registered successfully');
  res.redirect('/user/users');
});

// Show edit user form
const editUserForm = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/user/users');
  }
  res.render('users/userEdit', { user });
});

// Update user
const updateUser = catchAsync(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/user/users');
  }

  user.name = name;
  user.email = email;
  if (req.session.userRole === 'superadmin') {
    user.role = role;
  } else {
    user.role = 'staff';
  }

  await user.save();
  req.flash('success', 'User updated successfully');
  res.redirect('/user/users');
});

// Delete user
const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/user/users');
  }
  await User.findByIdAndDelete(req.params.id);
  req.flash('success', 'User deleted successfully');
  res.redirect('/user/users');
});

// ✅ Export all functions together
module.exports = {
  seedSuperAdmin,
  showLoginForm,
  loginUser,
  logout,
  showSuperadminForm,
  registerSuperadmin,
  listUser,
  showCreateForm,
  userRegister,
  editUserForm,
  updateUser,
  deleteUser
};
