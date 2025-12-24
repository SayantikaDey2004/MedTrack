import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/config/firebase"
import { toast } from "sonner"

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

  const handleReset = async () => {
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success("Password reset email sent. Check your inbox.")
      setEmail("")
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-3 px-4 sm:px-6 pt-5 sm:pt-6">
            <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors w-fit group"
            >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
            </button>
          <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>         
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6 pb-5 sm:pb-6">
          <FieldGroup>
            <FieldLabel className="text-sm sm:text-base">Email</FieldLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </FieldGroup>

          <Button
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
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
