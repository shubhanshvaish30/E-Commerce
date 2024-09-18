import Admin from '../models/Admin.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// login
const loginAdmin=async (req,res)=>{
    const {email,password}=req.body
    try{
        const admin=await Admin.findOne({email})
        if(!admin) 
            return res.json({success:false,msg:'Admin does not exist'})
        const isMatch=await bcrypt.compare(password,admin.password)
        if(!isMatch)
            return res.json({success:false,msg:'Wrong password'})
        const token=createToken(admin._id)
        res.json({success:true,token,admin})
    }
    catch(err){
        console.log(err)
        res.json({success:false,msg:"Error"})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// signup

const signupAdmin=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exists=await Admin.findOne({email})
        if(exists){
            return res.json({success:false,msg:'Email already exists'})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,msg:'Invalid email'})
        }

        if(password.length<8){
            return res.json({success:false,msg:'Please enter a strong password'})
        }
        // hashing
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newAdmin=new Admin({name,email,password:hashedPassword});
        const admin=await newAdmin.save();
        const token=createToken(admin._id);
        res.json({success:true,token,admin})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}

// logoutAdmin
const logoutAdmin = async (req, res) => {
    try {
        res.json({ success: true, msg: "Logged out successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: "Error logging out" });
    }
}



export  {loginAdmin,signupAdmin, logoutAdmin}