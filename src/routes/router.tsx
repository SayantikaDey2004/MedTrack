import { createBrowserRouter } from "react-router";
import { SignupForm } from "@/pages/auth/signup.page";
import { LoginForm } from "@/pages/auth/login.page";
import MedTrackHomepage from "@/pages/auth/home.page";


const Router = createBrowserRouter([
    {
        path: "/homepage",
        element: <MedTrackHomepage />
    },
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