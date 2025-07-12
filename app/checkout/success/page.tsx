"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  Download,
  Mail
} from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get session ID from URL for order lookup
  const sessionId = searchParams.get('session_id')

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
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Thank you for your purchase. Your order has been processed successfully.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                Order Confirmation
              </CardTitle>
              <CardDescription>
                Order ID: {sessionId || 'ORD-' + Date.now()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock order details - these would come from backend */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">5 Credits</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lesson Credits
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$14.95</p>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Save $1
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Paid</span>
                <span>$14.95 USD</span>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Credits have been added to your account</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Receipt</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Check your email for the receipt
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Download className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Start Learning</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use your credits for lessons
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                size="lg"
              >
                Browse Lessons
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/profile">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                size="lg"
              >
                View Account
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need help? Have questions about your purchase?
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}