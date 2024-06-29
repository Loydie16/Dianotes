import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "@/components/ui/use-toast";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      axiosInstance
        .get(`/verify-email`, { params: { token } })
        .then((response) => {
          toast({
            title: "Success",
            description: response.data.message,
          });
          navigate("/login");
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error.response?.data?.message || "Verification failed.",
          });
          navigate("/login");
        });
    }
  }, [location, navigate]);

  return <div>Verifying your email...</div>;
}

export default VerifyEmail;
