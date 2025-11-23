// middleware/auth.js

// Check if user is logged in and handle session timeout
const isAuthenticated = (req, res, next) => {
  const maxIdleTime = 5 * 60 * 1000; // 5 minutes in ms

  if (req.session && req.session.userId) {
    const now = Date.now();

    // Check last activity
    if (req.session.lastActivity && now - req.session.lastActivity > maxIdleTime) {
      // Session expired due to inactivity
      req.session.destroy(err => {
        if (err) console.error(err);
        req.flash('error', 'Session expired due to inactivity. Please log in again.');
        return res.redirect('/user/login');
      });
    } else {
      // Update last activity time
      req.session.lastActivity = now;
      return next();
    }
  } else {
    req.flash('error', 'Please login first');
    return res.redirect('/user/login');
  }
};

// Role-based access
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.session.userRole || !roles.includes(req.session.userRole)) {
    req.flash('error', 'You are not authorized to access this page');
    return res.redirect('/dashboard'); // or '/login'
  }
  next();
};

module.exports = { isAuthenticated, authorizeRoles };
