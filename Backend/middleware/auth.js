import jwt from 'jsonwebtoken'

const authMiddleware=async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader){
        return res.json({ success: false, message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.json({success:false,message:'Unauthorized'}) 
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId=decoded.id;
        next();
    }catch(error){
        // console.log(error);
        return res.json({success:false,message:'Please Login!'})
    }
}

export default authMiddleware