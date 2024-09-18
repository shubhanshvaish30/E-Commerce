import mongoose from "mongoose";

export const connectDb=async ()=>{
    await mongoose.connect(process.env.MONGODB)
    .then(
        console.log("DB Connected Successfully")
    )
}