import dbConnect from "@/lib/connection";
import UserModel from "@/model/User";
import {z} from "zod"
import { userNameValidation } from "@/schema/signupSchema";

const UsernameQuerySchema=z.object({
    username:userNameValidation
});
export async function GET(request:Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url) ;
        const queryParam={
            username:searchParams.get("username")
        }
        // validate zod
       const result= UsernameQuerySchema.safeParse(queryParam);
       console.log(result,"result");
       if(!result.success){
        const usernameErrors=result.error.format().username?._errors||[]
        return Response.json({
            succes:false,
            message:usernameErrors.length>0?usernameErrors.join(', '):"Invalid query parameters",
            status:400
        })
       }
       const {username}=result.data;
       const existingUserIsVerified=await UserModel.findOne({username,isVerified:true})
       if(existingUserIsVerified){
        return Response.json({
            succes:false,
            message:"username is already taken",
            status:400
        })
       }
       return Response.json({
        succes:true,
        message:"username is unique",
        status:400
    })

        
    } catch (error) {
        console.log("Erroe while checking username",error);
        return Response.json({
            success:false,
            status:500,
            message:"Error while checking username"
        })

        
    }
    
}
