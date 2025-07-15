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
  Mail,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { getCheckoutSummary, CheckoutSummary } from "@/services/checkout/get-checkout-summary"

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutData, setCheckoutData] = useState<CheckoutSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get session ID from URL for order lookup
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push('/login')
        return
      }
      setIsAuthenticated(true)

      // Fetch checkout data if session_id is available
      if (sessionId) {
        try {
          const data = await getCheckoutSummary(sessionId)
          
          // Verify checkout is completed
          if (data.status !== 'COMPLETED') {
            setError("Checkout session is not completed")
            setIsLoading(false)
            return
          }

          setCheckoutData(data)
          // Trigger event to refresh user profile in navbar after successful purchase
          window.dispatchEvent(new CustomEvent('refreshUserProfile'))
        } catch (err: any) {
          setError(err.message || "Failed to load order details")
        }
      } else {
        setError("No checkout session found")
      }
      
      setIsLoading(false)
    }

    checkAuthAndFetchData()
  }, [router, sessionId])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthenticatedNavbar currentPage="checkout" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !checkoutData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthenticatedNavbar currentPage="checkout" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Order Error</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "Unable to load order details"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  Try Again
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Account
                </Button>
              </Link>
            </div>
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
                Order ID: {checkoutData.orderId || checkoutData.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{checkoutData.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {checkoutData.type === 'CREDITS' ? 'Lesson Credits' : 'Subscription'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${checkoutData.amount.toFixed(2)}</p>
                  {checkoutData.savings && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {checkoutData.savings}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Paid</span>
                <span>${checkoutData.amount.toFixed(2)} USD</span>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {checkoutData.type === 'CREDITS' 
                      ? 'Credits have been added to your account' 
                      : 'Subscription has been activated'
                    }
                  </span>
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