import express from 'express'
import { getCart,updateQuant } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js'

const cartRouter=express.Router()

// cartRouter.post("/add",authMiddleware,addTo)
// cartRouter.post("/remove",authMiddleware,removeFrom)
cartRouter.get("/get",authMiddleware,getCart)
cartRouter.post("/update",authMiddleware,updateQuant)

export default cartRouter