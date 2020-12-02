var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
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

router.get('/cartview', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/cartview', {products : null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cartview', {products: cart.createProductArray(), totalPrice : cart.totalPrice});
});

router.get('/checkoutcart', function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/cartview');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkoutcart', {totalPrice: cart.totalPrice});

});
 
module.exports = router;
