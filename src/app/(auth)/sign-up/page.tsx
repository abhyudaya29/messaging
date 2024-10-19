"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import  * as z from "zod"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
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
const page = () => {
    const[username,setUsername]=useState('');
    const[userNameMessage,setUserNameMessage]=useState('');
    const[isCheckingUserName,setIsCheckingUserName]=useState(false);
    const[isSubmiting,setIsSubmiting]=useState(false);
    const debounced=useDebounceCallback(setUsername,300);
    const {toast}=useToast()
    const router = useRouter()

    const form=useForm<z.infer< typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    });
    useEffect(()=>{
        const checkUserNameUniqueness=async ()=>{
            if(username){
                setIsCheckingUserName(true);
                setUserNameMessage('');
                try {
                    const response=await axios.get(`/api/check-username-unique?username=${username}`);
                    setUserNameMessage(response.data?.message)
                } catch (error) {
                    const AxiosError=error as AxiosError<ApiResponse>;
                    setUserNameMessage(AxiosError.response?.data.message?? "Error checking user name");


                } finally{
                    setIsCheckingUserName(false);

                }
            }
        }
        checkUserNameUniqueness();
    },[username])
     const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
        setIsSubmiting(true);
        try {
            const response=await axios.post<ApiResponse>(`/api/sign-up`,data);
            toast({
                title:"Success",
                description:response.data.message
            })
            router.replace(`/verify/${username}`);
            setIsSubmiting(false);
        } catch (error) {
            console.log("error in signup of user",error)
            toast({
                title:"Error",
                description: "Error checking user name",
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
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="username" {...field}
                        onChange={(e)=>{
                            field.onChange(e)
                            debounced(e.target.value)
                        }}
                         />
                         
                    </FormControl>
                    {isCheckingUserName && <Loader2 className='animate-spin'/>}
                    <p className={`text-sm ${userNameMessage==="username is unique"?'text-green-500':'text-red-500'}`}>
                        test {userNameMessage}
                    </p>
                    <FormMessage />
                    </FormItem>
                )}
                /> 
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
                    
                    </>):('Signup')}
                </Button>
            </form>
        </Form>
        <div className='text-center mt-4'>
            <p>
                Already member?{' '}
                <Link href={"/sign-in"} className='text-blue-600 hover:text-blue-800'>Sign in</Link>
            </p>

        </div>

        </div>
        
    </div>
    </>
  )
}

export default page