import mongoose from "mongoose";
// const Review = require('./Review');

const productSchema= new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required:true
    },
    img: {
        type:String,
        trim:true,
        // default:
    },
    price: {
        type:Number,
        min:0,
        required:true
    },
    desc:{
        type:String,
        trim:true
    },
    category:{
        type:String,
        trim:true,
        required: true
    },
    subCategory:{
        type:String,
        trim:true,
        required:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    // author:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // }
})

// middleware
// productSchema.post('findOneAndDelete',async function(product){
//     if(product.reviews.length>0){
//         await Review.deleteMany({_id:{$in:product.reviews}})
//     }
// })

const Product=mongoose.model.Product || mongoose.model('Product',productSchema);


export default Product