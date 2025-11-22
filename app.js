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
// const multer = require('multer'); // Removed, as it's not used in this file.

const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/category');

const app = express();

// Connect Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waretrack-db')
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));

// MODERN EXPRESS BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Method-Override
app.use(methodOverride('_method'));

app.use(
  session({
    secret: "Tiktoktalk", // change to something secure
    resave: false,
    saveUninitialized: false,
    // Setting secure and maxAge is recommended for production
    // cookie: { secure: app.get('env') === 'production', maxAge: 24 * 60 * 60 * 1000 } 
  })
);

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success") || [];
  res.locals.error_msg = req.flash("error") || [];
  res.locals.warning_msg = req.flash("warning") || [];
  next();
});

// ROUTE HANDLERS
app.use('/', dashboardRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);

// catch 404
app.use(function(req, res, next) {
  // Using http-errors utility here
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;