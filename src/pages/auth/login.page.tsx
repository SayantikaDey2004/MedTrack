import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signInWithEmailAndPassword } from "firebase/auth"
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
import { signInWithPopup } from "firebase/auth"
import { auth, googleAuthProvider } from "@/config/firebase"
import { useState } from "react"
import { getUserByEmail } from "@/api/auth"

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
    const user = result.user;// google theke user to peyei ja66e.
    //tahole amader ke db theke akta query kore check kore nite hbe first e based on the user variable 
    const isUserPresentInDb = await getUserByEmail(user.email!);
    if (!isUserPresentInDb) {
      setError("No user found with Google account.");
      return;
    }

    navigate("/");
  } catch (error) {
    console.error("Google login failed:", error);
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
    const isUserPresentInDb = await getUserByEmail(user.email!);
    if (!isUserPresentInDb) {
      setError("Invalid email or password.");
      return;
    }
    navigate("/");
  } catch (error: any) {
    console.error("Manual login failed:", error);

    if (error.code === "auth/wrong-password") {
      setError("Incorrect password. Please try again.");
    } else if (error.code === "auth/user-not-found") {
      setError("User not found");
    } else {
      setError("Login failed. Please try again later.");
    }
  }
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
         { /* <CardDescription>
            Enter your email below to login to your account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
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
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button" onClick={handleLoginWithGoogle}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/signup"className="font-semibold">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </CardContent>
      </Card>
    </div>
  )
 }