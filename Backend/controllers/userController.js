import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import nodemailer from 'nodemailer'
import Mailgen from "mailgen"
import Address from "../models/Address.js"

// login
const loginUser=async (req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if(!user) 
            return res.json({success:false,msg:'User does not exist'})
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.json({success:false,msg:'Wrong password'})
        const token=createToken(user._id)
        res.json({success:true,msg:"Logged In",token,user})
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

const signup=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exists=await User.findOne({email})
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

        const newUser=new User({name,email,password:hashedPassword});
        const user=await newUser.save();
        const token=createToken(user._id);
        res.json({success:true,msg:"Account Created!!",token,user})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}

// logout
const logout = async (req, res) => {
    try {
        res.json({ success: true, msg: "Logged Out" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: "Error logging out" });
    }
}

// // send mail
// const sendMail=async(req,res)=>{
//     const {email,userName}=req.body;
//     let config={
//         service:process.env.SMTP_SERVICE,
//         auth:{
//             user:process.env.EMAIL,
//             pass:process.env.PASSWORD,
//         }
//     }
//     let transporter=nodemailer.createTransport(config)
//     let MailGenerator=new Mailgen({
//         theme:"default",
//         product:{
//             name:"Mailgen",
//             link:'https://mailgen.js/'
//         }
//     })
//     let response={
//         body:{
//             name:userName,
//             intro:"Congratulations, You just have created your account. Start shopping with us!",
//             table:{
//                 data:[
//                     {
//                         item:"Nodemailer Stack Book",
//                         description:"A Backend Application",
//                         price:"$10",
//                     }
//                 ]
//             },
//             outro:"Explore variety of products at our website"
//         }
//     }
//     const Email=process.env.EMAIL;
//     let mail=MailGenerator.generate(response)
//     let message={
//         from:Email,
//         to:email,
//         subject:"Welcome to our website",
//         html:mail
//     }
//     transporter.sendMail(message).then(()=>{
//         return res.json({success:true,msg:"Welcome to E-Bazaar"})
//     }).catch(e=>{
//         console.log(e);
        
//         res.json({e})
//     })
// }

// send mail
// const sendMail = async (req, res) => {
//     const { email, userName, type, details } = req.body; // Added 'type' and 'details'
    
//     let config = {
//         service: process.env.SMTP_SERVICE,
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD,
//         }
//     };
//     let transporter = nodemailer.createTransport(config);
//     let MailGenerator = new Mailgen({
//         theme: "default",
//         product: {
//             name: "E-Bazaar",
//             link: 'https://yourwebsite.com'
//         }
//     });

//     let response;
//     switch (type) {
//         case 'signup':
//             response = {
//                 body: {
//                     name: userName,
//                     intro: "Congratulations, you have successfully created your account!",
//                     description: "Start exploring our website and enjoy a variety of products and services we offer.",
//                     button: {
//                         color: '#22BC66', // Optional: Customize button color
//                         text: 'Go to Homepage',
//                         link: 'https://yourwebsite.com'
//                     },
//                     outro: "If you have any questions, feel free to contact our support team."
//                 }
//             };
//             break;
//         case 'order':
//             response = {
//                 body: {
//                     name: userName,
//                     intro: "Thank you for placing an order with us!",
//                     description: `Your order #${details.orderId} has been successfully placed.`,
//                     table: {
//                         data: details.items.map(item => ({
//                             item: item.productName,
//                             description: item.description,
//                             price: `$${item.price}`,
//                         }))
//                     },
//                     outro: "We will notify you once your order is shipped. If you have any questions, contact our support team."
//                 }
//             };
//             break;
//         // Add more cases as needed
//         default:
//             response = {
//                 body: {
//                     intro: "Thank you for getting in touch with us!",
//                     outro: "If you have any questions, feel free to contact our support team."
//                 }
//             };
//             break;
//     }

//     const Email = process.env.EMAIL;
//     let mail = MailGenerator.generate(response);
//     let message = {
//         from: Email,
//         to: email,
//         subject: type === 'signup' ? "Welcome to Our Website!" : "Order Confirmation",
//         html: mail
//     };

//     try {
//         await transporter.sendMail(message);
//         res.json({ success: true, msg: "Email sent successfully!" });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ success: false, msg: "Failed to send email." });
//     }
// };

const sendMail = async (req, res) => {
    const { email, userName, type, details } = req.body;

    // Check if email and other required fields are provided
    if (!email || !userName || !type) {
        return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    let config = {
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "E-Bazaar",
            link: 'https://yourwebsite.com'
        }
    });

    let response;
    switch (type) {
        case 'signup':
            response = {
                body: {
                    name: userName,
                    intro: "Congratulations, you have successfully created your account!",
                    description: "Start exploring our website and enjoy a variety of products and services we offer.",
                    button: {
                        color: '#22BC66',
                        text: 'Go to Homepage',
                        link: 'https://yourwebsite.com'
                    },
                    outro: "If you have any questions, feel free to contact our support team."
                }
            };
            break;
        case 'order':
            response = {
                body: {
                    name: userName,
                    intro: "Thank you for placing an order with us!",
                    description: `Your order #${details.orderId} has been successfully placed.`,
                    table: {
                        data: (details.orderItems || []).map(item => ({
                            item: item.productName || 'No product name',
                            description: item.description || 'No description',
                            price: item.price ? `$${item.price}` : 'No price'
                        }))
                    },
                    outro: "We will notify you once your order is shipped. If you have any questions, contact our support team."
                }
            };
            break;
        default:
            response = {
                body: {
                    intro: "Thank you for getting in touch with us!",
                    outro: "If you have any questions, feel free to contact our support team."
                }
            };
            break;
    }

    const Email = process.env.EMAIL;
    let mail = MailGenerator.generate(response);
    let message = {
        from: Email,
        to: email,
        subject: type === 'signup' ? "Welcome to E-Bazaar!" : "Order Confirmation",
        html: mail
    };

    try {
        await transporter.sendMail(message);
        res.json({ success: true, msg: "Email sent successfully!" });
    } catch (e) {
        console.error('Error sending email:', e);
        res.status(500).json({ success: false, msg: "Failed to send email." });
    }
};

const saveAddress=async(req,res)=>{
    try{
        const {address,city,state,country,pinCode,phoneNo}=req.body;
        let userId = req.body.userId;
        const newAddress=new Address({
            userId,address,city,state,country,pinCode,phoneNo
        })
        await newAddress.save()
        return res.json({success:true,newAddress,msg:"Address Saved Successfully"})
    }catch(e){
        console.log(e);
        return res.json({success:false,msg:"Error"})
    }
}

const getAddress=async(req,res)=>{
    try {
        const userId = req.body.userId;
        const addresses = await Address.find({ userId: userId });
        if (!addresses || addresses.length === 0) {
            return res.json({success: false,msg: "No addresses found for this user"});
        }
        return res.json({success: true,addresses});
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return res.json({success: false,msg:"Server error, please try again later"});
    }
}

const activeUser=async(req,res)=>{
    try{
        const activeUsers=await User.countDocuments({});
        res.json({activeUsers});
    }catch(error){
        res.status(500).json({message:'Server error'});
    }
}


export  {loginUser,signup, logout,sendMail,saveAddress,getAddress,activeUser}