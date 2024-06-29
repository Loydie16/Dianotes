"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../utils/axiosInstance";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2, MoveLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password cannot exceed 20 characters." })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number.",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
});

function Login() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Login API call
  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", {
        email: value.email,
        password: value.password,
      });

      if (!response.data.error) {
        navigate("/dashboard");
        toast({
          title: "Authenticated",
          description: response.data.message,
        });
      }

      if (response.data.error) {
        if (response.data.message === "Please verify your email first") {
          toast({
            variant: "destructive",
            title: "Email not verified",
            description:
              "We sent again an email verifcation link to your email address. Check it out.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.data.message,
          });
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === "Please verify your email first") {
          toast({
            variant: "destructive",
            title: "Email not verified",
            description:
              "We sent again an email verifcation link to your email address. Check it out.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* handle logout
  const handleLogout = async () => {
  try {
    await axiosInstance.post("/logout");
    // Redirect to login page or update state
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}; */

  return (
    <>
      <main className="flex justify-center items-center h-full min-h-screen mx-4">
        <Card className="w-[450px]">
          <CardHeader className="flex flex-row justify-between">
            <div className="space-y-2">
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your account credentials.</CardDescription>
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
                        navigate("/");
                      }}
                    >
                      <MoveLeft className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to home</p>
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
                        <Input
                          className=""
                          placeholder="Enter your email"
                          {...field}
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer "
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-end ">
                  <span className="dark:text-orange-200 text-xs italic font-semibold">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </span>
                </div>

                <Button
                  className="flex items-center justify-center w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <h1 className="text-sm">
              Don&apos;t have an account?{" "}
              <span>
                <Link to="/signup" className="font-bold dark:text-orange-200">
                  Sign Up
                </Link>
              </span>
              <span className="flex text-sm justify-center italic mt-6">
                &#169; Dianotes. 2024
              </span>
            </h1>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default Login;
