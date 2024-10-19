"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {z} from "zod"
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const[isLoading,setIsLoading]=React.useState(false);
  const{toast}=useToast()
  const form = useForm<z.infer< typeof messageSchema>>({
    resolver:zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async(data:any) => {
    setIsLoading(true);
    try {
      const response=await axios.post(`/api/send-messages`,{
        content:data.content,
        username
      })
      toast({
        title:"Success",
        description:"Message sent Successsfully",
      

    })
      
    } catch (error) {
      console.log("fetching while messages",error)
      const axiosError =error as AxiosError<ApiResponse>
      toast({
          title:"Error",
          description:axiosError.response?.data.message|| "Failed to fetch Messages",
          variant:"destructive"

      })
      
  }
    console.log("Form Data: ", data);
    
  };

  async function fetchSuggestedMessages(){
     try {
      const response=await axios.post(`/api/suggest-messages`);
      
      console.log(response.data,"ai messages")
      
     } catch (error) {
      console.log("fetching AI while messages",error)
      const axiosError =error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message|| "Failed to fetch Messages",
        variant:"destructive"

    })
      
     }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-[550px] shadow-lg">
        <CardHeader>
          <CardTitle>Send Anonymous Message to @{username}</CardTitle>
          <CardDescription>Send a personalized message anonymously.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Type your message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit">
            Send
          </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={fetchSuggestedMessages}>
            Suggest Ai Messages
          </Button>
         
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
