"use client"

import { Mail } from "lucide-react"
import Link from "next/link"

export default function EmailSentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10 sm:p-12 md:p-16 text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-100 p-5">
            <Mail className="h-12 w-12 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Check Your Inbox</h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
          We’ve sent a verification link to your email. Click the link to verify your account and start using Lingualy.
        </p>
        <div className="pt-4">
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Go to Login
            </Link>
        </div>
      </div>
    </div>
  )
}
