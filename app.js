var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
//Mongo DB Access
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');


var app = express();


const expressSession = require('express-session');


//Set up passport js
app.use(expressSession({
  name: 'session',
  secret: keys.session.cookieKey,
  maxAge: 24*60*60*1000,
  saveUninitialized : true,
  resave : true
}));
app.use(passport.initialize({compat: true}));
app.use(passport.session());
require('./config/passport-setup');



//Routers:
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var profRouter = require('./routes/profile-routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/// Add routers to app:
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', profRouter);



///Mongdb access:
var handleMDBError = (error)=>{
  console.log("Error: ", error);
}
mongoose.connect(keys.mongodb.DBURI).
  catch(error=>handleMDBError(error));







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
