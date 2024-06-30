import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./screens/Home";
import LoginPage from "./screens/Login";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/Dashboard";
import VerifyEmail from "./screens/VerifyEmail";
import ForgotPassword from "./screens/ForgotPassowrd";
import ResetPassword from "./screens/ResetPassword";
import SendVerification from "./screens/SendVerification";
import PageNotFound from "./screens/PageNotFound";
import Error from "./screens/Error";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { NoteProvider } from "./context/NoteContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated/RedirectIfAuthenticated";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
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
    errorElement: <Error />,
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
    errorElement: <Error />,
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
    errorElement: <Error />,
  },
  {
    path: "verify-email",
    element: <VerifyEmail />,
    errorElement: <Error />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
    errorElement: <Error />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
    errorElement: <Error />,
  },
  {
    path: "send-verification-email",
    element: <SendVerification />,
    errorElement: <Error />,
  },
  {
    path: "*",
    element: <PageNotFound />,
    errorElement: <Error />,
  },
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
