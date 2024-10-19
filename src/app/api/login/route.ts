import dbConnect from "@/lib/connection";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse, NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnect()
    try {
    const data=await request.json();
    console.log("data",data)
    const {email,password}=data;
    if(!email||!password){
        return NextResponse.json({
            success:false,
            status:400,
            message:"All fields are required"
        })
    }
    const checkUserExist=await UserModel.findOne({email});
    if(!checkUserExist){
        return NextResponse.json({
            success:false,
            status:404,
            message:"User does not exist with this email"
        })
    }
    const isPasswordValid=await bcryptjs.compare(password,checkUserExist.password);
    if(!isPasswordValid){
        return NextResponse.json({
            code: 401,
            success: false,
            message: "Password is incorrect"
        },{status:401});

    }

    const userData={
        id:checkUserExist._id,
        email:checkUserExist.email,
        username:checkUserExist.username
    };
    const token=jwt.sign(userData,process.env.TOKEN!,{expiresIn:'1d'});
    const response=NextResponse.json({
        success:true,
        message:"Logged In successfully",
        token:token,
        data:userData,
       
    },{status:200})
    response.cookies.set("token",token,{
        httpOnly: true, 
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    })
    return response
        
    } catch (error) {
        console.log("Error while logginign",error);
        return NextResponse.json({
            success:false,
            
            message:"Error while logging"
        },{status:500})
        
    }


    
}