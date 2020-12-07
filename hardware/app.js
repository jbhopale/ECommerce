var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var productRouter = require('./routes/product');
var mongoose = require('mongoose');
var app = express();
var user = require('./models/user');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var Handlebars = require('handlebars');
const { appendFileSync } = require('fs');

//Access the databse
mongoose.connect('mongodb://localhost:27017/hardwareshopping', { useUnifiedTopology: true,useNewUrlParser: true });

require('./config/passport');

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout', extname :'.hbs', helpers: {
  paginator: require('express-paginatorjs')
}}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret:'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection : mongoose.connection}),
  cookie:{ maxAge: 15 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  if(req.isAuthenticated())
  res.locals.admin = req.session.passport.user === "5fcd8f166d5b649a76a29ac3";
  next();
});
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/product', productRouter);
app.use('/', indexRouter);
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

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});


module.exports = app;
