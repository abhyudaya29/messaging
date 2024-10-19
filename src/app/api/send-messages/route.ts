import UserModel from "@/model/User";
import dbConnect from "@/lib/connection";
import { Message } from "@/model/User";
import exp from "constants";



export async function POST(request:Request) {
    await dbConnect();
    const {username,content}=await request.json();
    console.log(username,content)
    try {
       const user=await  UserModel.findOne({username});
       if(!user){
        return Response.json({
            success:false,
            message:"user not found",
            status:400
        })
       }
       if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:"user is not accepting messages",
            status:403
        })
       }
       const newMessage={content,createdAt:new Date()};
       user.message.push(newMessage as Message);
       await user.save();
       return Response.json({
        success:true,
        message:"message sent successfully",
        status:200
    })
       
        
    } catch (error) {
        console.log("error while sending messages",error)
        return Response.json({
            success:false,
            message:"Error while sending messages",
            status:500
        })
        
    }
    
}