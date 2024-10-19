import exp from "constants";
import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    message:Message[]
}
const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,'UserName is required'],
        trim:true,
        unique:true,


    },
    email:{
        type:String,
        required:[true,'email is required'],
        trim:true,
        unique:true,

        
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verifyCodeExpiry is required'],
        
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[MessageSchema]
})


const UserModel=(mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",UserSchema))
export default UserModel