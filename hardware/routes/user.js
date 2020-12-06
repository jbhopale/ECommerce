var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');


var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
});
  
router.post('/signup', passport.authenticate('local.signup',{
      failureRedirect:'/user/signup',
      failureFlash: true
  }), function(req, res, next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
      
    }else{
      res.redirect('/')
    }
});
  
//Get user login route
router.get('/login', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
});

router.post('/login', passport.authenticate('local.login',{
  
  failureRedirect:'/user/login',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    var reqMail = req.session.email;
    var adminMail = "jayant.bhopale@gmail.com";

    console.log("req mail", reqMail);
    console.log("admin mail", adminMail);

    console.log(reqMail === adminMail)

    res.redirect('/');
  }
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.cart = null; 
    res.redirect('/');
});

router.get('/orderHistory', isLoggedIn, function(req, res, next){
  console.log("ordder history get");
  Order.find({user: req.user}, function(err, orders){
      if(err){
        return res.write('Error!');
      }
      var cart;
      orders.forEach(function(order){
         cart = new Cart(order.cart);
         order.items = cart.createProductArray();
      });
      console.log(orders);
      res.render('user/orderHistory', {orders : orders});
    });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.cart = null; 
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) 
        return next();
    res.redirect('/');
}

module.exports = router;