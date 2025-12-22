import { createBrowserRouter } from "react-router";
import { SignupForm } from "@/pages/auth/signup.page";
import { LoginForm } from "@/pages/auth/login.page";
import MedTrackHomepage from "@/pages/home.page";
import ProtectedRoute from "@/components/protected";
import PublicRoute from "@/components/publicRoute";
import ForgotPasswordPage from "@/pages/auth/forgotPassword.page";
import AddMedicinePage from "@/pages/AddMedicinepage";
import ProfilePage from "@/pages/profile.page";
import MedicineTracker from "@/pages/medicineList.page";
import Layout from "@/components/layout";
// import { GoogleAuthButton } from "@/pages/auth/createAccount.page";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
            {
                index: true,
                element: <MedTrackHomepage />,
            },
            {
                path: "addMedicine",
                element: <AddMedicinePage />
            },
            {
                path: "profile-page",
                element: <ProfilePage />
            },
            {
                path: "medicine-list",
                element: <MedicineTracker />
            }
        ]
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
    }
    
    // {
    //     path: "/createAccount",
    //     element: <GoogleAuthButton/>
    // },
     
]);
export default Router;