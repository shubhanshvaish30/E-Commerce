import Product from "../models/Product.js";
import Review from "../models/Review.js";
import fs from 'fs'

const postReview=async (req,res)=>{
    try{
        const {id}=req.params;
        const {rating,comment}=req.body;
        const product=await Product.findById(id);
        const review=new Review({rating, comment});
        product.reviews.push(review);
        await review.save();
        await product.save();
        res.json({success:true,message:"Product Added Successfully!"})
    }
    catch(err){
        res.json({success:false,message:"Failed to Add Product"})
    }
}


export {postReview}