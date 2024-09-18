import mongoose from 'mongoose'


const userSchema= new mongoose.Schema({
    name:{type:String,
        trim:true,
        required:[true,"Please enter your Name!"]
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Please enter your Email!"],
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cart:  [{
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
    }]
},{minimize:false})

const User=mongoose.model('User',userSchema)||mongoose.model('User',userSchema);


export default User;