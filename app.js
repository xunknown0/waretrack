const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const multer = require('multer');
const flash = require("connect-flash");

const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products');


const app = express();

//Connect Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waretrack-db')
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Method-Override
app.use(methodOverride('_method'));

app.use(
  session({
    secret: "Tiktoktalk", // change to something secure
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Make flash messages available in all EJS views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});
app.use('/', dashboardRoutes);        // Dashboard routes
app.use('/products', productRoutes);  // Product routes



// catch 404
app.use(function(req, res, next) {
  res.status(404).render('error', { message: 'Page Not Found', error: {} });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

module.exports = app;