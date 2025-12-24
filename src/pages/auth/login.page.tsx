import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import logo from "@/assets/logo.svg"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { signInWithPopup,getAdditionalUserInfo,deleteUser } from "firebase/auth"
import { auth, googleAuthProvider} from "@/config/firebase"
import { useState } from "react"
import { FirebaseError } from "firebase/app"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");

const [error, setError] = useState<string | null>(null);

  const handleLoginWithGoogle = async () => {
  try {
    setError(null);
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    // Check if this is a brand new account
    const { isNewUser } = getAdditionalUserInfo(result);
    if (isNewUser) {
      // 1. Delete the newly created auth user so they aren't "registered"
      await deleteUser(user);
      
      // 2. Inform the user
      toast.error("No account found. Please sign up first.");
      return;
    }else{
  toast.success("Logged in successfully!");
    navigate("/");
    }
    // const isUserPresentInDb = await getUserByEmail(user.email!);
    // if (!isUserPresentInDb) {
    //   toast.error("No user found with Google account.");
    //   return;
    // }

  
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Failed to login with Google");
    }
  }


const HandleManualSignin = async () => {
  try {
    setError(null);

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = result.user;
    // const isUserPresentInDb = await getUserByEmail(user.email!);
    // if (!isUserPresentInDb) {
    //   toast.error("No user found with this email.");
    //   return;
    // }
    toast.success("Logged in successfully!");
    navigate("/");
  } catch (error) {
    console.error("Manual login failed:", error);
    if (error instanceof FirebaseError) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } 
      else if (error.code === "auth/user-not-found") {
        toast.error("User not found with this email.");
      } 
      else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } 
      else {
        toast.error("Login failed. Please try again later.");
      }
    } else {
      toast.error("Something went wrong.");
    }
  }
};

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50", className)} {...props}>
      <div className="w-full max-w-md">
        <Card className="border shadow-lg">
          <div className="flex justify-center pt-6">
            <img src={logo} alt="MedTrack Logo" className="h-16 w-16 sm:h-20 sm:w-20" />
              </div>
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-4">
            <CardTitle className="text-xl sm:text-2xl text-center">Login to your account</CardTitle>
         { /* <CardDescription>
            Enter your email below to login to your account
          </CardDescription> */}
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form
                onSubmit={(e) => {
                e.preventDefault()
                HandleManualSignin()
              }}
              >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 sm:h-11"
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                     to="/forgotPassword"
                      className="ml-auto inline-block text-xs sm:text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 sm:h-11"/>
                </Field>
                <Field>
                  <Button type="submit" className="w-full h-10 sm:h-11">Login</Button>
                  <Button variant="outline" type="button" onClick={handleLoginWithGoogle} className="w-full h-10 sm:h-11">
                    Login with Google
                  </Button>
                  <FieldDescription className="text-center text-xs sm:text-sm">
                    Don't have an account? <Link to="/signup"className="font-semibold">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
            {error && <div className="text-red-500 mt-4 text-center text-sm">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
 }