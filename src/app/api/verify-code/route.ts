import dbConnect from "@/lib/connection";
import UserModel from "@/model/User";
import {z} from "zod"
import { userNameValidation } from "@/schema/signupSchema";
import { NextRequest } from "next/server";


export async function POST(request:NextRequest) {
    const {username,code}=await request.json();
    const decodedUsername=decodeURIComponent(username);
    const user=await UserModel.findOne({username:decodedUsername});
    if(!user){

        return Response.json({
            success:false,
            message:"User not found",
            status:400
        })
    }
    const isCodeValid=user.verifyCode==code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true;
        await user.save();
        
        return Response.json({
            success: true,
            message: "Account verified successfully",
            status: 200 // 200 status indicates success
        });
    } else if (!isCodeValid) {
        // This block runs if the code is invalid
        return Response.json({
            success: false,
            message: "Incorrect Code",
            status: 400 // 400 status for incorrect code
        });
    } else {
        // This block runs if the code is expired
        return Response.json({
            success: false,
            message: "Verification failed. Invalid or expired code.",
            status: 400 // 400 if the code is expired
        });
    }
    


    
}