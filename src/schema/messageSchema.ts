import {z} from "zod"
export const messageSchema=z.object({
    content:z.string().min(10,"content must have at least 10 characters")
})