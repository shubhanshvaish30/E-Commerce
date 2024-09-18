import express from "express"
import authMiddleware from "../middleware/auth.js"
import { makePayment, sendStripeKey } from "../controllers/paymentController.js"

const paymentRouter=express.Router()

paymentRouter.post("/payment",authMiddleware,makePayment)
paymentRouter.get('/stripeKey',authMiddleware,sendStripeKey)

export default paymentRouter;