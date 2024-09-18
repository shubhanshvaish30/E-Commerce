import express from "express"
import { activeUser, getAddress, loginUser,logout,saveAddress,sendMail,signup } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter=express.Router()

userRouter.post('/signup',signup)
userRouter.post('/login',loginUser)
userRouter.post('/logout',logout)
userRouter.post('/mail',sendMail)
userRouter.post('/address',authMiddleware,saveAddress)
userRouter.get('/getAddress',authMiddleware,getAddress)
userRouter.get('/active-users',activeUser)

export default userRouter