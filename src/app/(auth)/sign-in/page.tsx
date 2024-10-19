"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import  * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"

import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schema/signupSchema'
import axios,{AxiosError} from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from '@/components/ui/form'
import { FormField,FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schema/signInSchema'
import local from 'next/font/local'
const page = () => {
    const[username,setUsername]=useState('');
    const[userNameMessage,setUserNameMessage]=useState('');
    const[isCheckingUserName,setIsCheckingUserName]=useState(false);
    const[isSubmiting,setIsSubmiting]=useState(false);
    const debouncedUserName=useDebounceValue(username,300);
    const {toast}=useToast()
    const router = useRouter()

    const form=useForm({
        // resolver:zodResolver(signInSchema),
        defaultValues:{
            email:'',
            password:'',
        }
    });
     const onSubmit=async (data:any)=>{
        setIsSubmiting(true);
        try {
            const response=await axios.post<ApiResponse>(`/api/login`,data);
            toast({
                title:"Success",
                description:response.data.message
            })
            console.log(response,"ressss")
            localStorage.setItem("userData",JSON.stringify(response))
            router.replace(`/dashboard`);
            console.log("yesss")

            setIsSubmiting(false);
        } catch (error) {
            console.log("error in signup of user",error)
            toast({
                title:"Error",
                description: "Error in signin",
                variant:"destructive"
            })
            setIsSubmiting(false)
        }
        
     }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type='email' placeholder="Email" {...field}
                         />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                /> 
                  <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="Password" {...field}
                         />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                /> 
                <Button type='submit' disabled={isSubmiting}>
                    {isSubmiting?(<>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'>

                    </Loader2>
                    Please wait
                    
                    </>):('SignIn')}
                </Button>
            </form>
        </Form>
        <div className='text-center mt-4'>
            <p>
                New  member?{' '}
                <Link href={"/sign-up"} className='text-blue-600 hover:text-blue-800'>Sign up</Link>
            </p>

        </div>

        </div>
        
    </div>
    </>
  )
}

export default page