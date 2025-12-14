import { createBrowserRouter } from "react-router";
import { SignupForm } from "@/pages/auth/signup.page";
import { LoginForm } from "@/pages/auth/login.page";


const Router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginForm />
    },
  {
        path: "/signup",
        element: <SignupForm />
    },
]);
export default Router;