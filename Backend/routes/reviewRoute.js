import express from "express";
import { postReview } from "../controllers/reviewController.js";
const reviewRouter=express.Router();



reviewRouter.post("/review",postReview)

export default reviewRouter