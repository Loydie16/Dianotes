import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
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

function ResetPassword() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    let interval;
    if (isOtpButtonDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (timer === 0) {
      setIsOtpButtonDisabled(false);
    }

    return () => clearInterval(interval);
  }, [isOtpButtonDisabled, timer]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/reset-password", {
        email,
        password: value.password,
      });

      if (!response.data.error) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully.",
        });
        navigate("/login");
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
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setIsOtpButtonDisabled(true);
    setTimer(60); // 1 minute countdown
    try {
      const response = await axiosInstance.post("/send-otp", {
        email,
      });

      if (!response.data.error) {
        toast({
          title: "OTP Sent",
          description: "Check your email for the OTP to reset your password.",
        });
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
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axiosInstance.post("/validate-otp", {
        email,
        otp: form.getValues("otp"),
      });

      if (!response.data.error) {
        setOtpVerified(true);
        toast({
          title: "OTP Verified",
          description: "OTP has been successfully verified.",
        });
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
        title: "Error",
        description: error.response?.data?.message || error.message,
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
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your OTP and new password to reset your account.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <ModeToggle />
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5"
            >
              <div className="flex items-center justify-between flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <InputOTP
                          className="flex justify-center items-center"
                          maxLength={6}
                          disabled={otpVerified}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="self-center mt-4 md:self-end"
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={otpVerified}
                >
                  {loading
                    ? "Verifying..."
                    : otpVerified
                    ? "Verified"
                    : "Verify OTP"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="text-xs h-5 p-1"
                  onClick={resendOTP}
                  disabled={isOtpButtonDisabled || otpVerified}
                >
                  Resend OTP
                </Button>
                {isOtpButtonDisabled && !otpVerified && (
                  <span className="text-xs text-gray-500 ml-2">
                    {`Resend available in ${timer}s`}
                  </span>
                )}
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={!otpVerified}
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

              <Button
                className="w-full"
                type="submit"
                disabled={loading || !otpVerified}
              >
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
