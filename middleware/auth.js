// Check if user is logged in
module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  req.flash('error', 'Please login to access this page.');
  res.redirect('/user/login');
};

// Check user roles
module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.userRole)) {
      req.flash('error', 'You are not authorized to access this page.');
      return res.redirect('/');
    }
    next();
  };
};
