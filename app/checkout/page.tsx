"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { getPricingOptions, PricingOptions } from "@/services/pricing"
import { createCheckoutSession, CreateCheckoutSessionRequest } from "@/services/checkout"

interface OrderSummary {
  type: 'credits' | 'subscription'
  pricingId: number
  quantity?: number
  selectionType?: string
  subscriptionId?: number
  price: number
  savings?: string
  label: string
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
  const [pricingData, setPricingData] = useState<PricingOptions | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get parameters from URL
  const type = searchParams.get('type') as 'credits' | 'subscription'
  const quantity = searchParams.get('quantity')
  const selectionType = searchParams.get('selection')
  const subscriptionId = searchParams.get('id')

  // Fetch pricing data and validate order
  useEffect(() => {
    const validateOrder = async () => {
      try {
        // Check authentication
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          router.push('/login?redirect=/checkout')
          return
        }
        setIsAuthenticated(true)

        // Fetch pricing data
        const pricing = await getPricingOptions()
        setPricingData(pricing)

        // Validate and create order summary
        if (type === 'credits') {
          const qty = parseInt(quantity || '1')
          const selection = selectionType || 'custom'
          
          let price = 0
          let label = ''
          let savings: string | undefined

          let pricingId: number | undefined

          if (selection === 'custom') {
            price = qty * pricing.credits.unitPrice
            label = `${qty} Credit${qty !== 1 ? 's' : ''}`
            pricingId = pricing.credits.unitPricingId
          } else if (selection === 'preset5') {
            const preset = pricing.credits.presetOptions.find(p => p.quantity === 5)
            if (preset) {
              price = preset.price
              label = `${preset.quantity} Credits`
              savings = preset.savings
              pricingId = preset.id
            }
          } else if (selection === 'preset10') {
            const preset = pricing.credits.presetOptions.find(p => p.quantity === 10)
            if (preset) {
              price = preset.price
              label = `${preset.quantity} Credits`
              savings = preset.savings
              pricingId = preset.id
            }
          }

          if (price > 0 && pricingId) {
            setOrderSummary({
              type: 'credits',
              pricingId,
              quantity: qty,
              selectionType: selection,
              price,
              label,
              savings
            })
          } else {
            setError('Invalid credit selection')
          }
        } else if (type === 'subscription' && subscriptionId) {
          const subId = parseInt(subscriptionId)
          const subscription = pricing.subscriptions.find(s => s.id === subId)
          
          if (subscription) {
            setOrderSummary({
              type: 'subscription',
              pricingId: subscription.id,
              subscriptionId: subId,
              price: subscription.price,
              label: subscription.label,
              savings: subscription.savings
            })
          } else {
            setError('Invalid subscription selection')
          }
        } else {
          setError('Invalid order parameters')
        }
      } catch (err) {
        console.error('Error validating order:', err)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    validateOrder()
  }, [type, quantity, selectionType, subscriptionId, router])

  const handlePayment = async () => {
    if (!orderSummary) return
    
    setIsProcessing(true)
    setError(null)

    try {
      // Create checkout session with backend
      const request: CreateCheckoutSessionRequest = {
        pricingId: orderSummary.pricingId,
        ...(orderSummary.quantity && { quantity: orderSummary.quantity })
      }

      const response = await createCheckoutSession(request)
      
      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('Failed to create checkout session. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditOrder = () => {
    router.push('/pricing')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthenticatedNavbar currentPage="checkout" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
            <p className="text-gray-600 dark:text-gray-300">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthenticatedNavbar currentPage="checkout" />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Checkout Error</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <Button onClick={() => router.push('/pricing')} className="w-full">
                Return to Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AuthenticatedNavbar currentPage="checkout" />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/pricing" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Review your order and complete your purchase
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {orderSummary?.type === 'credits' ? (
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Calendar className="h-5 w-5 text-orange-600" />
                    )}
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderSummary && (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{orderSummary.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {orderSummary.type === 'credits' ? 'Lesson Credits' : 'Full Access Subscription'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${orderSummary.price.toFixed(2)}</p>
                          {orderSummary.savings && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {orderSummary.savings}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total</span>
                        <span>${orderSummary.price.toFixed(2)} USD</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                onClick={handleEditOrder}
                className="w-full"
              >
                Edit Order
              </Button>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Secure payment powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment form will be integrated here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading checkout...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}