import { asyncHandler } from "../utils/asyncHandler.js" ;
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username , email
    // check for images , check for avatar
    // upload them to cloudinary , avatar check
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response


    // get user details from frontend
    const { fullName , username, email, password } = req.body;
    
    // validation - not empty
    if(!fullName || !username  || !email || !password ) {
        throw new ApiError(400 , "All fields are required");
    }

    // check if user already exists : username , email
    let existUser = await User.findOne({ $or: [{ username },{ email }] });
    if(existUser) {
        if(user.username === username) {
            throw new ApiError(409 , `Username ${username} is already taken`);
        } else{
            throw new ApiError(409 , `Email ${email} is already registered`);
        }
    }

    // check for images , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path ;
    const coverImageLocalPath = req.files?.coverImage[0]?.path ;
    if(!avatarLocalPath){
        throw new ApiError(422 , 'Avatar image is missing');
    }

    // upload them to cloudinary , avatar check
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(422 , 'Avatar image is missing');
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName ,
        username : username.toLowerCase() ,
        email : email.toLowerCase(),
        password ,
        avatar : avatar.url ,
        coverImage : coverImage ? coverImage.url : null
    })

    // remove password and refresh token field from response
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    
    // check for user creation

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while creating the User")
    }

    // return response
    return res.status(201).json(
        new ApiResponse (200 , createdUser , "User registered Successfuly")
    );
});


export {registerUser} ;