const express = require('express');
const cors = require('cors');  
const router = express.Router();
const create_product = require('../controller/create_product');
const payment = require('../controller/payment');
const order = require('../controller/order');
const user = require('../controller/user');
const multer = require('multer'); 
const upload = multer();
const verifyToken = require('../middleware/verifyAdmin');

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));  

router.get('/', (req, res) => {
    res.send('hello every one in the world');
});

router.get('/success', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Success</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
        <script>
            Swal.fire({
                title: 'Order Submit Successful',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'https://www.strongpackagings.com';
                }
            });
        </script>
    </body>
    </html>
`);
});
router.get('/cancel', (req, res) => {
    res.send('Payment not receive');
});

router.get('/all_product', create_product.fetch_product);
router.post('/store_order', upload.none(), order.store_order );
router.post('/onlinecharge/confirm_order', payment.online_order);
router.put('/cashondelivery/confirm_order', order.cash_on_delivery );
router.post('/create_token', payment.create_token );

router.post('/admin_signup', user.signup);
router.post('/admin_login', user.login);
router.get('/all_order',verifyToken, order.fetchOrder);
router.put('/update_product/:id',create_product.upload_profile, create_product.updatedProduct);
router.post('/create_product',create_product.create_prodcut_api);
router.delete('/delete_product/:id',  create_product.delete_product);








module.exports = router;
