import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilePath) => {
    try {
        if(!localfilePath) return null;
        //uploading file to cloudinary
        const response = cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto",
        })
        //file has been uploaded successfully
        console.log("File has been uploaded on cloudinary", (await response).url);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath);
        //remove the file from local storage in case of error
        return null;
    }
}

export {uploadOnCloudinary};