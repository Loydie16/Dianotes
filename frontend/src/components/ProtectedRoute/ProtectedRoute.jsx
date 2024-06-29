import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get("/auth-status");
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Authentication check failed",
          description: error.message,
        });
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
