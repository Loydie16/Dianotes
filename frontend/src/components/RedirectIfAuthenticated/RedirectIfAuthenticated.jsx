import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const RedirectIfAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get("/auth-status");
        setIsAuthenticated(response.data.authenticated);
        toast({
          title: "Authenticated Success",
          description: "You are already authenticated",
        });
      } catch (error) {
        // Show a toast only for network errors or other unexpected issues
        if (error.response && error.response.status !== 401) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.message,
          });
        }
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={32} />

        <h1 className=" mt-10 font-medium">
          Please wait a moment as the backend of this website is hosted on a
          free service, which might cause some delays
        </h1>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default RedirectIfAuthenticated;
