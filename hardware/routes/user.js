var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);
router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
  });
  
router.get('/logout', function(req, res) {
    req.logout(); 
    res.redirect('/');
});
  router.post('/signup', passport.authenticate('local.signup',{
      successRedirect:'/',
      failureRedirect:'/user/signup',
      failureFlash: true
  }));
  
  router.get('/profile', isLoggedIn, function(req, res, next){
    res.render('user/profile');
  });
  
  //Get user login route
  router.get('/login', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
  });
  
  router.post('/login', passport.authenticate('local.login',{
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash: true
  }));

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  // <-- typo here
        return next();
    res.redirect('/');
}


  module.exports = router;
