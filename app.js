const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');



const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');

const app = express();

//Connect Database

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waretrack-db')
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Method-Override
app.use(methodOverride('_method'));

//Express Session
app.use(session({
  secret: 'keyboard Warrior',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use('/', indexRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;