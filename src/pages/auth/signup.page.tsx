import { manualSignUp, signUpWithGoogle } from "@/api/auth"
import { Button } from "@/components/ui/button"
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
import { auth, googleAuthProvider } from "@/config/firebase"
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { Link, useNavigate } from "react-router"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSignUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);

    // Google Access Token
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;

    // Signed-in user info
    const user = result.user;
   if (!user) return;

    const payload = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      provider: "google",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await signUpWithGoogle(payload);
    console.log("Google Sign-In successful:", user);
      navigate("/");
    // return { user, token };
  } catch (error:any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);

    console.error("Google Sign-In Error:", {
      errorCode,
      errorMessage,
      email,
      credential,
    });

    throw error; // rethrow if you want caller to handle it
  }
};

const handleManualSignup = async () => {
  try {
    setError(null)
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const result = await createUserWithEmailAndPassword(auth,email,password)
    const user = result.user
    
    // Update the user's display name in Firebase Auth
    await updateProfile(user, {
      displayName: name
    })
    
    const payload = {
      uid: user.uid,
      name: name,
      email: user.email,
      photoURL: user.photoURL,
      provider: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
     await manualSignUp(payload);

    navigate("/")
  } catch (error: any) {
    console.error("Manual signup failed:", error)

    if (error.code === "auth/email-already-in-use") {
      setError("Email already in use")
    } else if (error.code === "auth/weak-password") {
      setError("Password should be at least 6 characters")
    } else {
      setError("Signup failed. Please try again.")
    }
  }
};

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      {/* <CardDescription>
          Enter your information below to create your account
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleManualSignup();
        }}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="Enter your name" required 
              value={name}
              onChange={(e) => setName(e.target.value)}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/*<FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>*/}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Enter your password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              {/* <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="Confirm password" required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
              { /* <FieldDescription>Please confirm your password.</FieldDescription> */}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button" onClick={handleSignUpWithGoogle}>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?<Link to="/login" className="font-semibold">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
         {error && (
          <div className="text-red-500 mt-4 text-center">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
    
  )
}
