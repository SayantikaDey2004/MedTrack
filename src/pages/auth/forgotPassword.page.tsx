import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/config/firebase"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,

} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Password reset email sent. Check your inbox.")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
            <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors w-fit group"
            >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
            </button>
          <CardTitle>Forgot Password</CardTitle>         
        </CardHeader>

        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FieldGroup>

          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            className="w-full"
            onClick={handleReset}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
