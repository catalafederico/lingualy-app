"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  XCircle, 
  ArrowLeft, 
  RefreshCw,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"

export default function CheckoutCancelPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push('/login')
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthenticatedNavbar currentPage="checkout" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AuthenticatedNavbar currentPage="checkout" />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your payment has been cancelled. No charges were made to your account.
            </p>
          </div>

          {/* Information Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happened?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Payment Process Interrupted
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Your payment was cancelled before completion. This could happen if you:
                    </p>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 ml-4 space-y-1">
                      <li>• Clicked the back button during payment</li>
                      <li>• Closed the payment window</li>
                      <li>• Experienced a connection issue</li>
                      <li>• Decided not to complete the purchase</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Good news:</strong> No charges were made to your payment method. 
                  You can try again whenever you're ready.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/pricing">
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/lessons">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Lessons
              </Button>
            </Link>
          </div>

          {/* Alternative Options */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                If you're experiencing issues with payment, we're here to help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Payment Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Having trouble with your payment method?
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Free Resources</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Explore our free lessons while you decide
                  </p>
                  <Link href="/lessons">
                    <Button variant="outline" size="sm" className="w-full">
                      View Free Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}