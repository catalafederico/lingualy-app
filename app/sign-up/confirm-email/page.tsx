"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import axios, { HttpStatusCode } from "axios"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { confirmEmail } from "@/services/auth/confirm-email"
import { sendVerificationEmail } from "@/services/auth/send-verification-email"

enum Status {
    LOADING = "loading",
    SUCCESS = "success",
    INVALID = "invalid",
    ERROR = "error"
}

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const [status, setStatus] = useState<Status>(Status.LOADING)

  useEffect(() => {
    const confirmEmailUseEffect = async () => {
      if (!token) {
        setStatus(Status.INVALID)
        return
      }

      try {
        await confirmEmail(token)
        setStatus(Status.SUCCESS)
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
          setStatus(Status.INVALID)
        } else {
          setStatus(Status.ERROR)
        }
      }
    }

    confirmEmailUseEffect()
  }, [token])

  const handleResendVerificationEmailClick = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await sendVerificationEmail(email)
      router.push("/sign-up/email-verification")
    } catch (error: any) {
        setStatus(Status.ERROR)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10 sm:p-12 md:p-16 text-center space-y-8">
        {status === Status.LOADING && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-600" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">Confirming your email...</h2>
          </>
        )}

        {status === Status.SUCCESS && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">Email Confirmed!</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">Thanks for confirming your email. You can now log in to your account.</p>
            <div className="pt-4">
                <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                    Go to Login
                </Link>
            </div>
          </>
        )}

        {status === Status.INVALID && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">Invalid or Expired Token</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">The confirmation link is no longer valid. Please request a new one.</p>
            <div className="pt-4">
                <Link onClick={handleResendVerificationEmailClick} href="/sign-up/email-verification" className="text-amber-600 hover:text-amber-700 font-medium">
                    Resend Verification Email
                </Link>
            </div>
          </>
        )}

        {status === Status.ERROR && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">Something Went Wrong</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto0">We couldn't confirm your email. Please try again later.</p>
            <div className="pt-4">
                <Link href="/support" className="text-amber-600 hover:text-amber-700 font-medium">
                    Contact Support
                </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 px-4">
        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10 sm:p-12 md:p-16 text-center space-y-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-600" />
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">Loading...</h2>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
