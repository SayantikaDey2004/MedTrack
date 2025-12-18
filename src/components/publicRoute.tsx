import useAuth from "@/context/auth.context";
import { Navigate } from "react-router";

const PublicRoute =({children}:{children:React.ReactNode})=>{
    const {user,loading}=useAuth();
    if(loading){
        return <div>Loading...</div>
    }
    if(user){
        return <Navigate to="/" replace />;
    }

     return <>{children}</>;
}

export default PublicRoute;