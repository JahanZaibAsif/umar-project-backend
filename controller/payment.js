require('dotenv').config();

const Product = require('../model/product');
const Order = require('../model/order');

const stripe = require('stripe')(process.env.stripe_screat_key);





const online_order = async (req , res) => {
    const orderId = req.body.orderId;
    const StoreOrder = await Order.findById(orderId);
    const product_name = StoreOrder.product_name;
    const product_price = StoreOrder.product_price;
    const delivery_charge = StoreOrder.delivery_charge;
    const count = StoreOrder.count;
    const total_price = product_price + delivery_charge;
  
    

    const card = 'card';
    const payment = 'payment';

    const checkout = await stripe.checkout.sessions.create({
        payment_method_types: [card],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: product_price * 100,
                    product_data: {
                        name: product_name,
                    },
                },
                quantity: count,
            },
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: delivery_charge * 100,
                    product_data: {
                        name: 'Delivery Charge',
                    },
                },
                quantity: count,
            },
        ],
        mode:payment,
        success_url: 'https://6454-39-61-38-54.ngrok-free.app/success',
        cancel_url: 'https://6454-39-61-38-54.ngrok-free.app/cancel',
        metadata: {
          order_id: orderId,
      },
    });
      console.log('price:', checkout.url);
    res.send(checkout.url);
}



const create_token = async (req, res) => {
    const paymentMethodId = req.body.paymentMethodId;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, 
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method: paymentMethodId,
        confirm: true,
      });
  
      res.status(200).json({ message: 'Payment confirmed successfully', paymentIntent });
     
    } catch (error) {
    //   console.error('Error confirming payment:', error);
      if (error.type === 'StripeCardError') {
              console.error('Error confirming payment:', error.message);

        res.status(400).json({ message:error.message});
      } else {
        res.status(500).json({ error: 'An error occurred while confirming your payment.' });
      }
    }
  };
  





module.exports = {
    online_order,
    create_token
}