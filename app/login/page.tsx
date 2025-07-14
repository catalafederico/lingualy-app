"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { loginUser } from "@/services/auth/login"
import { handleGoogleLoginClick } from "@/services/auth/google"
import { handleFacebookLoginClick } from "@/services/auth/facebook"
import { AxiosError, HttpStatusCode } from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

      await loginUser({email, password})
      router.push("/")

    } catch (error: any) {
      if(error.status === HttpStatusCode.Forbidden){
        router.push("/sign-up/email-verification")
      }
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 dark:bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-lg relative mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-amber-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
                Welcome Back to Lingualy
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 mt-2 text-center text-sm sm:text-base">
                Sign in to access your teaching resources
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-left block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 sm:h-12 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-left block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 sm:h-12 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                  {error && <p className="text-sm text-red-500 text-left">{error}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    disabled={isLoading}
                  />
                  <span className="text-gray-600 dark:text-gray-300">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800 px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <Button onClick={handleGoogleLoginClick} variant="outline" className="h-10 sm:h-12 border-gray-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-slate-700 text-sm sm:text-base" disabled={isLoading}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button onClick={handleFacebookLoginClick} variant="outline" className="h-10 sm:h-12 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-slate-700 text-sm sm:text-base" disabled={isLoading}>
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8 text-center">
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium text-sm sm:text-base">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
