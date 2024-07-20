require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.databaseLink);
const productSchema = new mongoose.Schema({
    product_name:{
        type:String
    },
    product_picture:{
        type:String
    },
    product_detail:{
        type:String
    },
    product_price:{
        type:Number
    },
    product_quantity:{
        type:Number
    }
});

const Product = mongoose.model('product',productSchema);

module.exports = Product;