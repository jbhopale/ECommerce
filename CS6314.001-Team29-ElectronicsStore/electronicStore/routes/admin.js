var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');
var formidable = require('formidable');

router.get('/addProduct', function(req, res, next){
  console.log("addp product get");
  var messages = req.flash('error');
  res.render('admin/addProduct');
});

router.post('/addProduct',isLoggedIn, function(req, res, next){
    var product = new Product();
    
    product.productImagePath=req.body.img;
    console.log(req.body.img.path);
    product.productName=req.body.name;
    product.productDescription= req.body.description;
    product.productPrice= req.body.price;
    console.log(req.body.price);
    product.productQuantity = req.body.quantity;
    product.productCategory = req.body.category;
    product.isNotSoftDeleted = true;
    product.save();
    
    res.redirect('/');
});

router.get('/deleteProducts', function(req, res, next){
  var messages = req.flash('error');
  Product.find(function(err,docs){
    var productChunk = [];
    for(var i = 0 ; i < docs.length ; i++){
       productChunk.push(docs[i]);
    }
    
    res.render('admin/deleteProducts', { title: 'Electronics Store', products: productChunk });
  });
});


router.get('/showProducts', function(req, res, next){
  var messages = req.flash('error');
  Product.find(function(err,docs){
    var productChunk = [];
    for(var i = 0 ; i < docs.length ; i++){
       productChunk.push(docs[i]);
    }
    
    res.render('admin/showProducts', { title: 'Electronics Store', products: productChunk });
  });
});

router.get('/updateProducts', function(req, res, next){
  var messages = req.flash('error');
  Product.find(function(err,docs){
    var productChunk = [];
    for(var i = 0 ; i < docs.length ; i++){
       productChunk.push(docs[i]);
    }
    
    res.render('admin/updateProducts', { title: 'Electronics Store', products: productChunk });
  });
});

router.get('/update/:id', function(req, res, next){
  var productId = req.params.id;
   Product.findOne({'_id':productId}, function(err, product){
         
     if(err){
         throw (err);
     }
 
     if(product){
       console.log(product);
       res.render('admin/updateProduct', { title: 'Electronics Store', product: product });
     }
   }); 
 
 });

 

router.get('/delete/:id', function(req, res, next){
 var productId = req.params.id;
  console.log('inside delete ger')
  Product.findOne({'_id':productId}, function(err, product){
        
    if(err){
        throw (err);
    }

    if(product){
      console.log("Product Found", product);
      product.isNotSoftDeleted = false;
      product.save();
    }
    Product.find(function(err,docs){
      var productChunk = [];
      for(var i = 0 ; i < docs.length ; i++){
        if(docs[i].isNotSoftDeleted)
        {
          productChunk.push(docs[i]);
        }
      }
      console.log(productChunk);
      res.redirect('/');
    });
  }); 

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