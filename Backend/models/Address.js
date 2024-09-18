import mongoose from "mongoose";

const addressSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    }
},{timestamps:true});

const Address = mongoose.model('Address', addressSchema);
   
export default Address;