"use client"
import { useToast } from "@/hooks/use-toast"
import { verifySchema } from "@/schema/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import  * as z from "zod"
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from '@/components/ui/form'
import { FormField,FormItem } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
const VerifyCode=()=>{
    const router=useRouter()
    const param=useParams<{username:string}>()
    const {toast}=useToast();

    const form=useForm<z.infer< typeof verifySchema>>({
        resolver:zodResolver(verifySchema)
    })
    const submit=async(data:z.infer<typeof verifySchema>)=>{
        try {
           const response= await axios.post('/api/verify-code',{
                username:param.username,
                code:data.code
            })
            toast({
                title:"Success",
                description:response.data.message
            })
            router.replace('sign-in')
        } catch (error) {
            console.log("error in verify code",error)
            toast({
                title:"Error",
                description: "Error in verify code",
                variant:"destructive"
            })
        }

    }
    return (
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify your Account
            </h1>
            <p className="mb-4">Enter Verification code sent on your email</p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
            </div>
         

        </div>
        </>
    )
}



export default VerifyCode