import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Link } from "react-router"
import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "@/lib/firebase"

declare global {
  interface Window {
    google: any
  }
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  // 🔹 Google Sign-In setup
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      )
    }
  }, [])

  // 🔹 Email + Password Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      console.log("User created:", userCredential.user)
      // 🔥 Here you can save user data to Firestore later
    } catch (err: any) {
      setError(err.message)
    }
  }

  // 🔹 Google Signup handler
  const handleGoogleResponse = async (response: any) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential)
      const result = await signInWithCredential(auth, credential)
      console.log("Google user:", result.user)
    } catch (err) {
      console.error("Google Sign-In Error", err)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </Field>

            {error && (
              <FieldDescription className="text-red-500 text-center">
                {error}
              </FieldDescription>
            )}

            <Button type="submit">Create Account</Button>

            <div id="google-signin-button" className="flex justify-center" />

            <FieldDescription className="text-center">
              Already have an account? <Link to="/login">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
