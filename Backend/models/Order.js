import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    orderItems:[
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
        },
    ],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
          type:String,
        },
        status:{
          type:String,
          default:"Pending"
        },
    },
    paidAt:{
        type:Date,
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing",
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now,
    },
})

const Order=mongoose.model.Order || mongoose.model('Order',orderSchema);

export default Order