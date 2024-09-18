import express from "express"
import { loginAdmin,logoutAdmin,signupAdmin } from "../controllers/adminController.js"
const adminRouter=express.Router()

adminRouter.post('/signup',signupAdmin)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/logout',logoutAdmin)


export default adminRouter