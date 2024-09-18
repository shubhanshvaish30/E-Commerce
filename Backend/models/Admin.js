import mongoose from 'mongoose'


const adminSchema= new mongoose.Schema({
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
},{minimize:false})

const Admin=mongoose.model('Admin',adminSchema)||mongoose.model('Admin',adminSchema);


export default Admin;