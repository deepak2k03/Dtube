import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config(
    {
        path:'./.env'
    }
);

console.log("Cloudinary ENV:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "OK" : "MISSING",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed")
})