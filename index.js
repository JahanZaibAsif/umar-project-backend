const express = require('express');
const app = express();
const all_routes = require('./routes/all_routes');
require('dotenv').config();
const stripe = require('stripe')(process.env.stripe_screat);
const Order = require('./model/order')
const bodyParser = require('body-parser');


const rawBodyMiddleware = bodyParser.raw({ type: '*/*' });

app.post('/stripe/webhook', rawBodyMiddleware, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.webhocksecret;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await updateDatabase(session);
    }

    res.status(200).json({ received: true });
});

async function updateDatabase(session) {
    try {
        const orderId = session.metadata.order_id;
        await Order.findByIdAndUpdate(orderId, { paymentStatus: true });
        console.log(`Order ${orderId} updated successfully.`);
    } catch (error) {
        console.error(`Failed to update the order: ${error.message}`);
    }
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// All other routes
app.use('/', all_routes);

const port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});
