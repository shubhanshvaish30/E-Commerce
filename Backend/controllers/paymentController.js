import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePayment=async (req, res) => {
    const {totalPrice}=req.body;
    if (isNaN(totalPrice) || totalPrice <= 0) {
        return res.json({ msg: 'Invalid total price' });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: 'inr',
            metadata: { company: "E-Bazaar" },
        });
        return res.json({ 
            success: true, 
            client_secret: paymentIntent.client_secret,
            msg: "Payment Successful"
        });
    } catch (error) {
        console.error('Error creating order or payment intent:', error);
        return res.json({ msg: 'Failed to create order or payment intent' });
    }
};

const sendStripeKey=async(req,res)=>{
    res.json({stripeApiKey:process.env.STRIPE_API_KEY})
}

export {makePayment,sendStripeKey}