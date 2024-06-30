;

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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

import axiosInstance from "../utils/axiosInstance";

import { ModeToggle } from "@/components/mode-toggle";

const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(12, {
        message: "Username must be at most 12 characters.",
      }),
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set this path to the field where the error should appear
  });

function SignUp() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  //Signup API call
  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/create-account", {
        userName: value.username,
        email: value.email,
        password: value.password,
      });

      if (!response.data.error) {
        toast({
          title: "Account created successfully",
          description: "Email verification link is sent to your email address.",
        });
        navigate("/login");
      }

      if (response.data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
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

  return (
    <>
      <div className="flex justify-center items-center h-full min-h-screen">
        <Card className="w-[450px]">
          <CardHeader className="flex flex-row justify-between">
            <div className="space-y-2">
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create an account.</CardDescription>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          placeholder="Enter your username"
                          {...field}
                        />
                      </FormControl>

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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password again"
                            {...field}
                          />
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
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

                <Button
                  className="flex items-center justify-center w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <h1 className="text-sm">
              Already have an account?{" "}
              <span>
                <Link to="/login" className="font-bold dark:text-orange-200">
                  Login
                </Link>
              </span>
              <span className="flex text-sm justify-center italic mt-6">
                &#169; Dianotes. 2024
              </span>
            </h1>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
