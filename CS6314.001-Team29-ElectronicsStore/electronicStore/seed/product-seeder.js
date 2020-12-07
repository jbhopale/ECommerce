var Product = require('../models/product');
var mongoose = require('mongoose');

//Access the databse
mongoose.connect('mongodb://localhost:27017/hardwareshopping', { useUnifiedTopology: true,useNewUrlParser: true });


var products = [
    new Product({
        productImagePath:'https://images-na.ssl-images-amazon.com/images/I/71MSEFI77DL._AC_SX679_.jpg',
        productName:'Dell Monitor 27 inches',
        productDescription:'Excellent quality and display',
        productPrice:200
}),
new Product({
    productImagePath:'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5451/5451300cv11d.jpg',
    productName:'HP Monitor 24 inches',
    productDescription:'Full HD 1920x1080 display',
    productPrice:100
})
];

var productCounter = 0;
for(var i = 0 ; i < products.length;i++){
    products[i].save(function(err, result){
        productCounter++;
        if(productCounter === products.length){
            exist();
        }
    });
}
function exit(){
    mongoose.disconnect();
}