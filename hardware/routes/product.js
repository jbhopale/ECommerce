var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');



var monk = require('monk');
var db = monk('localhost:27017/hardwareshopping');

router.get('/search', function(req, res){
    console.log("inside search get");
  });
  
  router.post('/search', function(req, res) {
    var productChunk = [];
                
    // title: { $regex: name, $options: "i" }
    var filter_genre = req.body.searchBy;
    var name = req.body.search;
    var collection = db.get('products');
    var products;
    var productsArray;
    // Case 1: If genre is selected and name is empty
  
    
    if(filter_genre!="" && name==""){
        Product.find({productCategory: filter_genre}, function(err, productsArray){
        if (err) throw err;
        else{
            var chunkSize = 3;
            for(var i = 0 ; i < productsArray.length ; i += chunkSize){
              productChunk.push(productsArray.slice(i, i + chunkSize));
            }
        res.render('shop/index', { title: 'Hardware Shop', products: productChunk });
      }
    });
  }
    // Case 2: If genre is selected and name is also searched
    else if(filter_genre!="" && name!=""){
        Product.find({productCategory: filter_genre,title: { $regex: name, $options: "i" }}, function(err, productsArray){
        if (err) throw err;
        else{
            var chunkSize = 3;
            for(var i = 0 ; i < productsArray.length ; i += chunkSize){
              productChunk.push(productsArray.slice(i, i + chunkSize));
            }
        res.render('shop/index', { title: 'Hardware Shop', products: productChunk });
      }
    });
  }
    // Case 3: If genre is not selected and name is selected
    else if(name!="" && filter_genre==""){
        Product.find({productName: { $regex: name, $options: "i" }}, function(err, productsArray){
        if (err) throw err;
        else{
                var chunkSize = 3;
                for(var i = 0 ; i < productsArray.length ; i += chunkSize){
                  productChunk.push(productsArray.slice(i, i + chunkSize));
                }
            res.render('shop/index', { title: 'Hardware Shop', products: productChunk });
        }
    });
  }
    // Case 4: If both genre & name are not selected
  else{
    Product.find({}, function(err, productsArray){
        if (err) throw err;
        //res.json(video);
        else{
            var chunkSize = 3;
            for(var i = 0 ; i < productsArray.length ; i += chunkSize){
              productChunk.push(productsArray.slice(i, i + chunkSize));
            }
        res.render('shop/index', { title: 'Hardware Shop', products: productChunk });
      }
    });
  }
  });

  module.exports = router;