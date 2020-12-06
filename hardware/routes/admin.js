var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');


router.get('/addProduct', function(req, res, next){
  console.log("addp product get");
  var messages = req.flash('error');
  res.render('admin/addProduct');
});

router.post('/addProduct',isLoggedIn, function(req, res, next){
  console.log("add product post");
 
    var product = new Product();
    
    product.productImagePath=req.body.img;
    product.productName=req.body.name;
    product.productDescription= req.body.description;
    product.productPrice= req.body.price;
    product.productQuantity = req.body.quantity;
    product.productCategory = req.body.category;
    product.save();

      res.render('admin/addProduct');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.cart = null; 
  res.redirect('/');
});

router.post('/search', function(req, res, next){
    console.log(req.body);
  });
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) 
        return next();
    res.redirect('/');
}

module.exports = router;