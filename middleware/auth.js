// Check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  req.flash('error', 'Please login first');
  res.redirect('/user/login');
};

// Role-based access
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.session.userRole || !roles.includes(req.session.userRole)) {
    req.flash('error', 'You are not authorized to access this page');
    return res.redirect('/dashboard'); // or login
  }
  next();
};



module.exports = { isAuthenticated, authorizeRoles };
