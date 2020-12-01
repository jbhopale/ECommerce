var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
    var productChunk = [];
    var chunkSize = 3;
    for(var i = 0 ; i < docs.length ; i += chunkSize){
      productChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Hardware Shop', products: productChunk });
  });
});

router.get('/user/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});

//Get user login route
router.get('/user/login', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/login', {csrfToken: req.csrfToken(), messages : messages, hasErrors : messages.length > 0});
});

router.post('/user/login', passport.authenticate('local.login',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/login',
  failureFlash: true
}));
module.exports = router;
