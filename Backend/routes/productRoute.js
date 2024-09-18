import express from "express";
import { addProd, addToCart, deleteProd, listProd,postReview,showProd } from "../controllers/productController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const prodRouter=express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });




prodRouter.get("/products",listProd)
prodRouter.get("/products/:id",showProd)
prodRouter.post("/products/:id/review",authMiddleware,postReview)
prodRouter.post("/products/:id/cart",authMiddleware,addToCart)


// admin
prodRouter.post("/add",upload.single("img"),authMiddleware,addProd)
prodRouter.post("/delete",authMiddleware,deleteProd)





export default prodRouter