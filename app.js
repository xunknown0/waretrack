const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require("connect-flash");

// Routes
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/category');
const usersRoutes = require('./routes/users');

const app = express();

// DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waretrack-db')
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

// EJS Layouts
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: "YourSecretKey",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Connect flash and make messages available in all views

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success') || [];
  res.locals.error_msg = req.flash('error') || [];
  res.locals.warning_msg = req.flash('warning') || [];
  res.locals.info_msg = req.flash('info') || [];
  res.locals.currentUserRole = req.session.userRole || null; 
  res.locals.currentPath = req.path; // current route path for sidebar highlighting  // needed for sidebar
  next();
});

// Routes
app.use('/dashboard', dashboardRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);
app.use('/user', usersRoutes);

// 404 page
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: {}
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export app
module.exports = app;
