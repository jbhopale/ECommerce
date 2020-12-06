var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
var Handlebars = require('handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err,docs){
    var productChunk = [];
    var chunkSize = 3;
    for(var i = 0 ; i < docs.length ; i += chunkSize){
      productChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Hardware Shop', products: productChunk, successMsg: successMsg, noMessage: !successMsg });
  });
});

router.get('/addToCart/:id', function(req, res, next){ 
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  productId = (productId.substring(productId.length/2));
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    console.log(product.productPrice);
    cart.add(product, product.id);
    req.session.cart = cart;
    
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cartview')
});

router.get('/cartview', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/cartview', {products : null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cartview', {products: cart.createProductArray(), totalPrice : cart.totalPrice});
});

router.get('/checkoutcart', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/cartview');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkoutcart', {totalPrice: cart.totalPrice});

});

router.post('/checkoutcart', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/cartview');
  }
  var order = new Order({
    user: req.user,
    cart: new Cart(req.session.cart),
    name: req.body.name,
    address: req.body.address
  });
  order.save(function(err, result){
    req.flash('success','Order placed successfully!');
    req.session.cart = null;
    res.redirect('/');
  });

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
      return next();
  req.session.oldUrl = req.url;
  res.redirect('/user/login');
}

module.exports = router;

Handlebars.registerHelper('ifAnd', function(v1, v2, options) {
  if(v1 && v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});