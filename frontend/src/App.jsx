import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./screens/Home";
import LoginPage from "./screens/Login";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/Dashboard";
import VerifyEmail from "./screens/VerifyEmail";
import ForgotPassword from "./screens/ForgotPassowrd";
import ResetPassword from "./screens/ResetPassword";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { NoteProvider } from "./context/NoteContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated/RedirectIfAuthenticated";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "signup",
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: "",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  }
]);

function App() {
  return (
    <>
      <NoteProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </NoteProvider>
    </>
  );
}

export default App;
