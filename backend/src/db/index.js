import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try {
        const baseUri = process.env.MONGODB_URI;
        if (!baseUri) {
            throw new Error("MONGODB_URI is not set");
        }

        const connectionInstance = await mongoose.connect(baseUri, {
            dbName: DB_NAME,
        });
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`); 
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectDB;