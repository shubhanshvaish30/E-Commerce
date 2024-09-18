import Product from "../models/Product.js";
import fs from 'fs'
import ApiFeatures from "../utils/apiFeatures.js";
import Review from "../models/Review.js";
import User from "../models/User.js";


// add products
const addProd=async  (req,res)=>{
    const img=`${req.file.filename}`
    try{
    let {name, price, desc,category,subCategory}=req.body;
    await Product.create({name, img, price, desc, category,subCategory});
    res.json({success:true,message:"Product Added Successfully!"})
    }
    catch(e){
        res.json({success:false,message:"Failed to Add Product"})
    }
}


// display all products
const listProd=async (req,res)=>{
    try{
        const apiFeature = new ApiFeatures(Product.find().populate('reviews'), req.query).filterByCategory();
        const products = await apiFeature.query;
        res.json({success:true,data:products})
    }
    catch(e){
        res.json({success:false,message:"Products not Displayed"})
    }
}


// delete a product
const deleteProd=async (req,res)=>{
    try{
        // let {id}=req.params;
        const prod=await Product.findById(req.body.id);
        fs.unlink(`uploads/${prod.img}`,()=>{})
        await Product.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Deleted"})
    }
    catch(e){
        // console.log(e)
        res.json({success:false,message:"Error"})
    }
}


const showProd=async (req,res)=>{
    const id=req.params.id;
    try{
        const prod=await Product.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'name'
            }
        });
        res.json({success:true,message:"Product is displayed",data:prod})
    }
    catch(e){
        console.log(e)
        res.json({success:false,message:"Error"})
    }
}
const postReview=async (req,res)=>{
    try{
        const {id}=req.params;
        const {rating,comment,userId}=req.body;
        console.log("bhaiyaa aa gyaa mai");
        const product=await Product.findById(id);
        const review=new Review({rating, comment,userId});
        product.reviews.push(review);
        await review.save();
        await product.save();
        res.json({success:true,message:"Product Added Successfully!"})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Failed to Add Product"})
    }
}

const addToCart=async(req,res)=>{
    try {
        const { userId, itemId, quantity } = req.body;
        if(!userId){
            return res.json({success:false,message:"Please Login!"})
        }
        let userData = await User.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let existingItem = userData.cart.find(item => item.product.toString() === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            userData.cart.push({
                product: itemId,
                quantity: quantity
            });
        }
        const totalQuantity = userData.cart.reduce((acc, item) => acc + item.quantity, 0);
        await userData.save();
        return res.json({ success: true, message: "Added to Cart",totalQuantity:totalQuantity,cart:userData.cart });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

export {addProd,listProd,deleteProd,showProd,postReview,addToCart}

