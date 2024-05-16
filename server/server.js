const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin:true, credentials: true }));

const port = process.env.PORT;
const stripeSekretKey = process.env.STRIPE_SEKRET_KEY;

const stripe = require('stripe')(stripeSekretKey);

app.post('/checkout', async(req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map(item => ({
                price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.product]
                }, 
                unit_amount: item.price * 100,
            },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: 'http://localhost:4242/success.html',
            cancel_url: 'http://localhost:4242/cancel.html'

        });

        res.status(200).json(session);
    } catch(e) {
        next(e);
    }
})

app.listen(port, () => console.log(`server is running on sever http://localhost:${port}`));