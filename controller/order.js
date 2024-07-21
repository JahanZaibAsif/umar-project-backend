require('dotenv').config();
const Order = require('../model/order');
const Product = require('../model/product');




const store_order = async (req, res) => {
    const {
        productId, product_name, product_price, color, size, total_price, count, user_name, user_phoneNumber, user_city, user_address
    } = req.body;

    const emptyFields = ['productId', 'product_name', 'product_price', 'color', 'size', 'total_price', 'count', 'user_name', 'user_phoneNumber', 'user_city', 'user_address']
        .filter(field => !req.body[field]);

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `The following fields are required: ${emptyFields.join(', ')}` });
    }

    try {
        // Fetch the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.product_quantity < count) {
            return res.status(400).json({ error: 'Quantity is less than your order' });
        }

        product.product_quantity -= count;
        await product.save();

        const order = new Order({
            productId, product_name, product_price, color, size, total_price, count, user_name, user_phoneNumber,
            user_city, user_address, delivery_charge: count
        });

        const savedOrder = await order.save();

        res.status(200).json({ message: "Order stored successfully", data: savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the order' });
    }
};



const cash_on_delivery = async (req , res) => {
    const orderId = req.body.orderId;
   const result = await Order.findByIdAndUpdate(orderId,{cash_on_delivery:true});
   console.log(result)
   if(result){  
    res.status(200).json({ message: 'Cash on Delivery Confirm ' });
}else{
    res.status(200).json({ message: 'Order Not' });
}

}

const fetchOrder = async(req ,res) => {
    const result = await Order.find();
    if(result){
        res.json({
            message: 'Order fetched successfully',
            success:true,
            data:result
        })
    }else{
        res.json({
            message: 'Order Not fetched',
            success:false,
            })
    }
}



module.exports = {
    store_order,
    cash_on_delivery,
    fetchOrder
}