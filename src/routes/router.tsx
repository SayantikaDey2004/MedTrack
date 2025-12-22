import { createBrowserRouter } from "react-router";
import { SignupForm } from "@/pages/auth/signup.page";
import { LoginForm } from "@/pages/auth/login.page";
import MedTrackHomepage from "@/pages/home.page";
import ProtectedRoute from "@/components/protected";
import PublicRoute from "@/components/publicRoute";
import ForgotPasswordPage from "@/pages/auth/forgotPassword.page";
import AddMedicinePage from "@/pages/AddMedicinepage";
import ProfilePage from "@/pages/profile.page";
// import { GoogleAuthButton } from "@/pages/auth/createAccount.page";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MedTrackHomepage /></ProtectedRoute>,
       
    },
     {
        path: "/addMedicine",
        element: <ProtectedRoute><AddMedicinePage/></ProtectedRoute>
    },
    {
        path: "/profile-page",
        element: <ProtectedRoute><ProfilePage/></ProtectedRoute>
    },
    {
        path: "/login",
        element: <PublicRoute><LoginForm /></PublicRoute>
    },
{
        path: "/signup",
        element: <PublicRoute><SignupForm /></PublicRoute>
    },

    {
        path: "/forgotPassword",
        element: <ForgotPasswordPage />
    },
    
    
    // {
    //     path: "/createAccount",
    //     element: <GoogleAuthButton/>
    // },
     
]);
export default Router;