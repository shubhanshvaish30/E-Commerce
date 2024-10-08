import express from "express";
import cors from "cors"
import { connectDb } from "./config/db.js";
import nodemailer from 'nodemailer';
import prodRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import orderRouter from "./routes/orderRoutes.js";


const app=express()



const allowedOrigins = [
    'https://e-commerce-frontend-dker.onrender.com',
    'https://e-commerce-admin-akx2.onrender.com'
];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from the allowed origins list
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

// middleware
app.use(express.json())
app.use(cors(corsOptions));   // we can access the backend from frontend

// Database Connection
connectDb();


// api end Point
app.use("",prodRouter)
app.use("",reviewRouter)
app.use("/images",express.static('uploads'))
app.use("/auth",userRouter)
app.use("/admin",adminRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)
app.use("/make",paymentRouter)


app.get('/',(req,res)=>{
    res.send('hello world')
})


app.listen(process.env.PORT,()=>{
    console.log("Server connected at", process.env.PORT)
})

