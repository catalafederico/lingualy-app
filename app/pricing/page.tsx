"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  Sparkles,
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  Star, 
  ArrowRight, 
  Zap,
  Plus,
  Minus,
  CreditCard,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { getPricingOptions, PricingOptions } from "@/services/pricing"

export default function PricingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<"en" | "es">("en")
  
  // New state for credits and subscription
  const [creditQuantity, setCreditQuantity] = useState(1)
  const [selectedDuration, setSelectedDuration] = useState("3months")
  const [creditSelectionType, setCreditSelectionType] = useState("custom")
  const [pricingData, setPricingData] = useState<PricingOptions | null>(null)
  const [isPricingLoading, setIsPricingLoading] = useState(true)

  // Fetch pricing data
  const fetchPricingData = async () => {
    try {
      const pricing = await getPricingOptions()
      setPricingData(pricing)
      // Set default subscription duration from first option
      if (pricing.subscriptions.length > 0) {
        setSelectedDuration(pricing.subscriptions[0].duration)
      }
    } catch (error) {
      console.error('Failed to fetch pricing data:', error)
    } finally {
      setIsPricingLoading(false)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    setIsAuthenticated(!!accessToken)

    // Initialize language
    const savedLanguage = localStorage.getItem("language") as "en" | "es" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Fetch pricing data
    fetchPricingData()

    setIsLoading(false)
  }, [])


  // Internationalization text
  const t = {
    en: {
      lessons: "Lessons",
      analytics: "Analytics",
      profile: "Profile",
      pricing: "Pricing",
      documentation: "Documentation",
      communityForum: "Community Forum",
      feedback: "Feedback",
      preferences: "Preferences",
      theme: "Theme",
      language: "Language",
      signOut: "Sign Out",
      light: "Light",
      dark: "Dark",
      english: "English",
      spanish: "Spanish",
    },
    es: {
      lessons: "Lecciones",
      analytics: "Análisis",
      profile: "Perfil",
      pricing: "Precios",
      documentation: "Documentación",
      communityForum: "Foro de la Comunidad",
      feedback: "Comentarios",
      preferences: "Preferencias",
      theme: "Tema",
      language: "Idioma",
      signOut: "Cerrar Sesión",
      light: "Claro",
      dark: "Oscuro",
      english: "Inglés",
      spanish: "Español",
    },
  }

  const currentText = t[language]

  // Credit management functions
  const incrementCredits = () => {
    setCreditQuantity(prev => Math.min(prev + 1, 100))
  }

  const decrementCredits = () => {
    setCreditQuantity(prev => Math.max(prev - 1, 1))
  }

  const handleCreditSelectionChange = (value: string) => {
    setCreditSelectionType(value)
  }

  // Calculate current credit price
  const getCurrentCreditPrice = () => {
    if (!pricingData) return 0
    
    if (creditSelectionType === "preset5") {
      return pricingData.credits.presetOptions.find(opt => opt.quantity === 5)?.price || 0
    } else if (creditSelectionType === "preset10") {
      return pricingData.credits.presetOptions.find(opt => opt.quantity === 10)?.price || 0
    } else {
      return creditQuantity * pricingData.credits.unitPrice
    }
  }

  // Get custom quantity price (always independent)
  const getCustomQuantityPrice = () => {
    if (!pricingData) return 0
    return creditQuantity * pricingData.credits.unitPrice
  }

  // Get current credit quantity for display
  const getCurrentCreditQuantity = () => {
    if (creditSelectionType === "preset5") return 5
    if (creditSelectionType === "preset10") return 10
    return creditQuantity
  }

  // Handle credit purchase
  const handleCreditPurchase = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing')
      return
    }
    
    const params = new URLSearchParams({
      type: 'credits',
      quantity: getCurrentCreditQuantity().toString(),
      selection: creditSelectionType
    })
    
    router.push(`/checkout?${params.toString()}`)
  }

  // Handle subscription purchase
  const handleSubscriptionPurchase = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing')
      return
    }
    
    const selectedSubscription = pricingData?.subscriptions.find(
      sub => sub.duration === selectedDuration
    )
    
    if (selectedSubscription) {
      const params = new URLSearchParams({
        type: 'subscription',
        id: selectedSubscription.id.toString()
      })
      
      router.push(`/checkout?${params.toString()}`)
    }
  }



  const faqs = [
    {
      question: "Can I switch between monthly and annual billing?",
      answer:
        "Yes! You can upgrade to annual billing at any time to start saving immediately. If you're on an annual plan and want to switch to monthly, the change will take effect at your next renewal date.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.",
    },
    {
      question: "Do you offer discounts for schools or districts?",
      answer:
        "Yes! We offer special pricing for schools, districts, and educational institutions. Contact our sales team for a custom quote based on your needs.",
    },
    {
      question: "Can I download materials for offline use?",
      answer:
        "All our materials are available for download in PDF format, so you can print them or use them offline whenever needed.",
    },
    {
      question: "What if I need to cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
    },
    {
      question: "Are there any setup fees or hidden costs?",
      answer:
        "No hidden fees! The price you see is exactly what you'll pay. No setup fees, no cancellation fees, no surprises.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {isAuthenticated ? (
        <AuthenticatedNavbar currentPage="pricing" />
      ) : (
        // Non-authenticated Navigation
        <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-700">
          <Link href="/" className="flex items-center justify-center">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
            </div>
            <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Lingualy
            </span>
          </Link>
          
          <nav className="ml-auto flex gap-6 items-center">
            {[
              { href: "/lessons", label: "Lessons" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/login", label: "Login" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                Sign Up
              </Button>
            </Link>
          </nav>
        </header>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-4 md:py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
          <div className="absolute top-10 left-10 w-48 h-48 bg-amber-200 dark:bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-48 h-48 bg-orange-200 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Choose Your <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Access Plan</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get the lessons you need with flexible pricing options
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Options */}
        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              
              {/* Lesson Credits Section */}
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Lesson Credits</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pay as you go. Perfect for occasional use.
                  </p>
                </div>

                <Card className="border-2 border-amber-200 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 min-h-[400px]">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="space-y-6 flex-1">
                      <h3 className="text-xl font-semibold text-center">Choose Credits</h3>
                      
                      {isPricingLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pricing options...</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-md mx-auto">
                          {/* Custom Credits Option */}
                          <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[72px]">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  decrementCredits();
                                  setCreditSelectionType("custom");
                                }}
                                disabled={creditQuantity <= 1}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-2 w-2" />
                              </Button>
                              <div className="text-base font-bold w-10 text-center">
                                {creditQuantity}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  incrementCredits();
                                  setCreditSelectionType("custom");
                                }}
                                disabled={creditQuantity >= 100}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => setCreditSelectionType("custom")}>
                              <div className="text-base font-semibold">Credits</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Choose your own amount</div>
                            </div>
                            <div className="text-xl font-bold text-amber-600 min-w-[100px] text-right">
                              ${getCustomQuantityPrice().toFixed(2)} USD
                            </div>
                          </div>

                          {/* Preset Options */}
                          <RadioGroup 
                            value={creditSelectionType} 
                            onValueChange={handleCreditSelectionChange} 
                            className="space-y-4"
                          >
                            {pricingData?.credits.presetOptions.map((preset) => (
                              <div key={preset.quantity} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[72px]">
                                <RadioGroupItem value={`preset${preset.quantity}`} id={`preset${preset.quantity}`} />
                                <Label htmlFor={`preset${preset.quantity}`} className="flex-1 cursor-pointer">
                                  <div className="text-base font-semibold">{preset.quantity} Credits</div>
                                  {preset.savings && (
                                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium mt-1">
                                      <span>💰</span>
                                      {preset.savings}
                                    </div>
                                  )}
                                </Label>
                                <div className="text-xl font-bold text-amber-600 min-w-[100px] text-right">
                                  ${preset.price.toFixed(2)} USD
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      
                      <div className="max-w-md mx-auto">
                        <Button 
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                          disabled={isPricingLoading}
                          onClick={handleCreditPurchase}
                        >
                          Buy {getCurrentCreditQuantity()} credit{getCurrentCreditQuantity() !== 1 ? 's' : ''} now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Access Subscription Section */}
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Full Access</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Unlimited lessons. Best value for regular users.
                  </p>
                </div>

                <Card className="border-2 border-orange-200 dark:border-orange-600 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 min-h-[400px]">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="space-y-6 flex-1">
                      <h3 className="text-xl font-semibold text-center">Choose Duration</h3>
                      
                      {isPricingLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pricing options...</p>
                        </div>
                      ) : (
                        <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="space-y-4 max-w-md mx-auto">
                          {pricingData?.subscriptions.map((option) => (
                            <div key={option.duration} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[72px]">
                              <RadioGroupItem value={option.duration} id={option.duration} />
                              <Label htmlFor={option.duration} className="flex-1 cursor-pointer">
                                <div className="text-base font-semibold">{option.label}</div>
                                {option.savings && (
                                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium mt-1">
                                    <span>💰</span>
                                    {option.savings}
                                  </div>
                                )}
                              </Label>
                              <div className="text-xl font-bold text-orange-600 min-w-[100px] text-right">
                                ${option.price.toFixed(2)} USD
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      <div className="max-w-md mx-auto">
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          disabled={isPricingLoading}
                          onClick={handleSubscriptionPurchase}
                        >
                          Subscribe now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="w-full py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Teachers Choose Lingualy</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of educators who save time and improve student engagement with our comprehensive
                resources.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full justify-items-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">10,000+ Resources</h3>
                <p className="text-gray-600 dark:text-gray-300">Comprehensive library covering all English teaching needs</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Save 10+ Hours</h3>
                <p className="text-gray-600 dark:text-gray-300">Weekly time savings with ready-to-use materials</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">50,000+ Teachers</h3>
                <p className="text-gray-600 dark:text-gray-300">Trusted by educators worldwide</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Expert Created</h3>
                <p className="text-gray-600 dark:text-gray-300">Materials crafted by certified educators</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know about Lingualy pricing and features.</p>
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-8 text-center">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg dark:bg-slate-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
              <Button variant="outline" className="border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Ready to Transform Your Teaching?
              </h2>
              <p className="text-xl text-amber-100 leading-relaxed">
                Join over 50,000 English teachers who use Lingualy to create engaging, effective lessons every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600 px-8 py-6 text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600 px-8 py-6 text-lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-amber-400" />
                <span className="text-2xl font-bold">Lingualy</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering English educators worldwide with premium teaching resources and materials.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resources</h3>
              <div className="space-y-2">
                <Link href="/lessons" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Lesson Plans
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Worksheets
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Assessments
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  ESL Materials
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Help Center
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Community
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Blog
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Lingualy. All rights reserved. Made with ❤️ for educators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
