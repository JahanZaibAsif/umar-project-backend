require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.databaseLink);

const orderSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    product_price:{
        type:String,
        required:true
    },
    user_name:{
        type:String,
        required:true
    },
    user_phoneNumber:{
        type:String,
        required:true
    },
    user_city:{
        type:String,
        required:true
    },
    user_address:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
     size:{
        type:String,
         required:true
    },
    count:{
        type:String,
        required:true
    },
    total_price:{
        type:String,
        required:true
    },
    delivery_charge:{
        type:String,
        required:true
    },
    cash_on_delivery:{
        type:Boolean,
        default:false
    },
    paymentStatus:{
        type:Boolean,
        default:false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Order  = mongoose.model('order' , orderSchema);
module.exports = Order 