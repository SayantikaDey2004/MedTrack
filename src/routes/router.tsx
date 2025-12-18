import { createBrowserRouter } from "react-router";
import { SignupForm } from "@/pages/auth/signup.page";
import { LoginForm } from "@/pages/auth/login.page";
import MedTrackHomepage from "@/pages/home.page";
import ProtectedRoute from "@/components/protected";
import PublicRoute from "@/components/publicRoute";
// import { GoogleAuthButton } from "@/pages/auth/createAccount.page";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MedTrackHomepage /></ProtectedRoute>
    },
    {
        path: "/login",
        element: <PublicRoute><LoginForm /></PublicRoute>
    },
  {
        path: "/signup",
        element: <PublicRoute><SignupForm /></PublicRoute>
    },
    // {
    //     path: "/createAccount",
    //     element: <GoogleAuthButton/>
    // },
    {/* {
        path: "/profilepage",
        element: <ProfilePage/>
    } */ }
]);
export default Router;