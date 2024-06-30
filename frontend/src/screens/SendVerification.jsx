;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

function SendVerification() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/send-verification-email", {
        email: value.email,
      });

      if (!response.data.error) {
        toast({
          title: "Verification email sent successfully",
          description: "Check your email for the link to verify your account.",
        });
        navigate(`/login`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error ito",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-full min-h-screen mx-4">
      <Card className="w-[450px]">
        <CardHeader className="flex flex-row justify-between">
          <div className="space-y-2">
            <CardTitle>Send Verification Link</CardTitle>
            <CardDescription>
                Enter your email address to send a verification link to reset your password.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    <MoveLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <h1 className="flex text-sm justify-center italic ">
            &#169; Dianotes. 2024
          </h1>
        </CardFooter>
      </Card>
    </main>
  );
}

export default SendVerification;
