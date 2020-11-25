var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    productImagePath :{
        type: String,
        required:true
    },
    productName :{
        type: String,
        required:true
    },
    productDescription :{
        type: String,
        required:true
    },
    productPrice :{
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('Product', schema);