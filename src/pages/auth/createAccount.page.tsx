import { useEffect } from "react"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useNavigate } from "react-router"

declare global {
  interface Window {
    google: any
  }
}

export function GoogleAuthButton() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleGoogleResponse,
    })

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
      }
    )
  }, [])

  const handleGoogleResponse = async (response: any) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential)
      const result = await signInWithCredential(auth, credential)

      console.log("User logged in:", result.user)

      // ✅ Redirect user into app
      navigate("/dashboard") // or "/"
    } catch (error) {
      console.error("Google login failed", error)
    }
  }

  return <div id="google-signin-button" className="flex justify-center" />
}