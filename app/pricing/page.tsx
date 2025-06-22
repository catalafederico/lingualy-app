"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Sparkles, Check, X, BookOpen, Users, Award, Clock, Star, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/landing/Navbar"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new teachers getting started",
      monthlyPrice: 19,
      annualPrice: 190,
      savings: 38,
      features: [
        { name: "500+ Lesson Plans", included: true },
        { name: "Basic Worksheets", included: true },
        { name: "Email Support", included: true },
        { name: "Mobile Access", included: true },
        { name: "Print-Ready Materials", included: true },
        { name: "Advanced Assessment Tools", included: false },
        { name: "Video Tutorials", included: false },
        { name: "Priority Support", included: false },
        { name: "Custom Branding", included: false },
        { name: "Bulk Downloads", included: false },
      ],
      popular: false,
      color: "amber",
    },
    {
      name: "Professional",
      description: "Most popular for experienced educators",
      monthlyPrice: 39,
      annualPrice: 390,
      savings: 78,
      features: [
        { name: "2,000+ Lesson Plans", included: true },
        { name: "Premium Worksheets", included: true },
        { name: "Priority Email Support", included: true },
        { name: "Mobile & Desktop Access", included: true },
        { name: "Print-Ready Materials", included: true },
        { name: "Advanced Assessment Tools", included: true },
        { name: "Video Tutorials", included: true },
        { name: "Priority Support", included: true },
        { name: "Custom Branding", included: false },
        { name: "Bulk Downloads", included: true },
      ],
      popular: true,
      color: "orange",
    },
    {
      name: "School",
      description: "Best for schools and departments",
      monthlyPrice: 79,
      annualPrice: 790,
      savings: 158,
      features: [
        { name: "Unlimited Lesson Plans", included: true },
        { name: "All Premium Content", included: true },
        { name: "24/7 Phone & Email Support", included: true },
        { name: "All Device Access", included: true },
        { name: "Print-Ready Materials", included: true },
        { name: "Advanced Assessment Tools", included: true },
        { name: "Video Tutorials", included: true },
        { name: "Priority Support", included: true },
        { name: "Custom Branding", included: true },
        { name: "Bulk Downloads", included: true },
      ],
      popular: false,
      color: "yellow",
    },
  ]

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
          <div className="absolute top-10 left-10 w-48 h-48 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-48 h-48 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Choose Your
                <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Teaching Plan
                </span>
              </h1>

              {/* Billing Toggle */}
              <div className="flex items-center gap-4 p-1 bg-white rounded-full shadow-lg border">
                <span
                  className={`px-4 py-2 text-sm font-medium transition-colors ${!isAnnual ? "text-amber-600" : "text-gray-600"}`}
                >
                  Monthly
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="data-[state=checked]:bg-amber-500"
                />
                <span
                  className={`px-4 py-2 text-sm font-medium transition-colors ${isAnnual ? "text-amber-600" : "text-gray-600"}`}
                >
                  Annual
                </span>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 ml-2">
                  Save 20%
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={plan.name}
                  className={`relative border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                    plan.popular
                      ? "border-orange-300 bg-gradient-to-br from-white to-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-sm font-medium">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>

                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>

                      {isAnnual && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-500">Billed annually: ${plan.annualPrice}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Save ${plan.savings}/year
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Link href="/signup">
                      <Button
                        className={`w-full h-12 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        }`}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-500"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enterprise CTA */}
            <div className="mt-16 text-center">
              <Card className="max-w-2xl mx-auto border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
                  <p className="text-gray-600 mb-6">
                    Perfect for large schools, districts, or organizations with specific needs. Get custom pricing,
                    dedicated support, and tailored solutions.
                  </p>
                  <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="w-full py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Teachers Choose Lingualy</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of educators who save time and improve student engagement with our comprehensive
                resources.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">10,000+ Resources</h3>
                <p className="text-gray-600">Comprehensive library covering all English teaching needs</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Save 10+ Hours</h3>
                <p className="text-gray-600">Weekly time savings with ready-to-use materials</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">50,000+ Teachers</h3>
                <p className="text-gray-600">Trusted by educators worldwide</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Expert Created</h3>
                <p className="text-gray-600">Materials crafted by certified educators</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Everything you need to know about Lingualy pricing and features.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
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
                    variant="secondary"
                    className="bg-white text-amber-600 hover:bg-gray-100 shadow-lg px-8 py-6 text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
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
