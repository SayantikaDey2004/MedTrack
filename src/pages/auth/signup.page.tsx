import { signUpWithGoogle } from "@/api/auth"
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
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Link, useNavigate } from "react-router"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
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


  
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      {/* <CardDescription>
          Enter your information below to create your account
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="Enter your name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              {/*<FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>*/}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Enter your password" required />
              {/* <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="Confirm password" required />
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
      </CardContent>
    </Card>
    
  )
}
