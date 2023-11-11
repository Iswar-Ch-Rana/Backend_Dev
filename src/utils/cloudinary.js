import { v2 as cloudinary } from "cloudinary";
import fs from "fs" ;

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload on cloudinary

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null 
        // Upload The File on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        });
        console.log("File is uploaded on Cloudinary",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove the locally saved temporary file as the upload operation got failed
        return null ;
    }
}

export { uploadOnCloudinary };