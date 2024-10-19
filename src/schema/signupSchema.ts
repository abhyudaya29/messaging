import {z} from "zod"

export const userNameValidation=z.string().min(2,"username must contain at least 2 letters")
.max(20,"username must be less tha  20 letters").regex(/^[a-zA-Z0-9_]+$/,"username must not contain any special character")


export const signUpSchema=z.object({
    username:userNameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(2)
})

