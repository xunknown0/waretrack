const User = require('../models/userModel');

// Async wrapper
const catchAsync = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Seed superadmin (run once)
const seedSuperAdmin = catchAsync(async (req, res) => {
  const existing = await User.findOne({ role: 'superadmin' });
  if (!existing) {
    await new User({
      name: 'Mae',
      email: 'superadmin@example.com',
      password: 'qwerty12345', // Change this later
      role: 'superadmin'
    }).save();
    console.log('Default superadmin created!');
  }
  res.send('Superadmin seeded successfully!');
});

// Show login form
const showLoginForm = (req, res) => {
  res.render('users/login', { // Updated path
    error_msg: req.flash('error'),
    success_msg: req.flash('success')
  });
};

// Login user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/user/login'); // redirect path stays the same
  }

  req.session.userId = user._id;
  req.session.userRole = user.role;
  req.flash('success', 'Logged in successfully');
  res.redirect('/'); // redirect to dashboard
});

// Logout user
const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/user/login'));
};

// List users (Admin/Superadmin)
const listUser = catchAsync(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.render('users/list', { users }); // Updated path
});

// Show create user form (Superadmin)
const showCreateForm = (req, res) => {
  res.render('users/userCreate', { // Updated path
    error_msg: req.flash('error'),
    success_msg: req.flash('success')
  });
};

// Register user (Superadmin)
const userRegister = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    req.flash('error', 'Email already exists');
    return res.redirect('/user/users/register');
  }

  let assignedRole = role || 'staff';
  if (assignedRole !== 'staff' && req.session.userRole !== 'superadmin') {
    assignedRole = 'staff';
  }

  await new User({ name, email, password, role: assignedRole }).save();
  req.flash('success', 'User registered successfully');
  res.redirect('/user/users');
});

module.exports = {
  seedSuperAdmin,
  showLoginForm,
  loginUser,
  logout,
  listUser,
  showCreateForm,
  userRegister
};
