"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Award, Globe, Heart, Target, Lightbulb, Mail, MapPin, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/landing/Navbar"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { isAuthenticated } from "@/lib/auth"
import { getUserProfile } from "@/services/auth/user-profile"

export default function AboutPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Initialize theme and check authentication on component mount
  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true)
    
    // Initialize theme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }

    // Check authentication by validating token with backend
    const validateAuthentication = async () => {
      const hasToken = isAuthenticated()
      
      if (hasToken) {
        try {
          // Validate token by fetching user profile
          await getUserProfile()
          setIsAuth(true)
        } catch (error) {
          console.error('Token validation failed:', error)
          // Token is invalid or backend is down, clear it and treat as unauthenticated
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userRole')
          setIsAuth(false)
        }
      } else {
        setIsAuth(false)
      }
      
      setIsLoading(false)
    }

    validateAuthentication()
  }, [])

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      bio: "Former high school English teacher with 15 years of classroom experience. Passionate about making quality education accessible to all.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Dr. James Rodriguez",
      role: "Head of Curriculum",
      bio: "PhD in Education with expertise in curriculum development. Previously worked with major educational publishers.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emily Chen",
      role: "Lead Designer",
      bio: "Specializes in educational design and user experience. Creates engaging, teacher-friendly interfaces.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Thompson",
      role: "Technology Director",
      bio: "Full-stack developer with a passion for education technology. Ensures our platform is reliable and scalable.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Teacher-First",
      description: "Every decision we make is guided by what's best for educators and their students.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We maintain the highest standards in all our educational materials and resources.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making quality education resources available to teachers everywhere, regardless of budget.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving and adapting to meet the evolving needs of modern education.",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Teachers Served" },
    { number: "10,000+", label: "Lesson Plans" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "150+", label: "Countries Reached" },
  ]

  // Show loading while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isAuth ? <AuthenticatedNavbar currentPage="about" /> : <Navbar />}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
                Our Story
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Empowering Teachers,
                <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Inspiring Students
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded by educators, for educators. Lingualy was born from the belief that every teacher deserves access
                to high-quality, engaging resources that make teaching more effective and enjoyable.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center text-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
                    Our Mission
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-gray-100">
                    Transforming Education Through
                    <span className="block text-amber-600">Quality Resources</span>
                  </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center lg:text-left">
                  At Lingualy, we believe that great teaching starts with great resources. Our mission is to provide
                  English educators worldwide with comprehensive, curriculum-aligned materials that save time, enhance
                  learning, and inspire both teachers and students.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center lg:text-left">
                  We understand the challenges teachers face - limited time, budget constraints, and the constant need
                  for fresh, engaging content. That's why we've created a platform that addresses these pain points
                  while maintaining the highest educational standards.
                </p>
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Our Goal</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      To be the most trusted resource for English educators globally
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-3xl opacity-30"></div>
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  width="600"
                  height="500"
                  alt="Teachers collaborating"
                  className="relative mx-auto rounded-3xl object-cover shadow-2xl border-8 border-white dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Our Impact
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Numbers that reflect our commitment to supporting educators worldwide
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full justify-items-center">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-8">
                    <div className="text-4xl font-bold text-amber-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The principles that guide everything we do at Lingualy
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full justify-items-center">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Passionate educators and technologists working together to transform teaching
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 w-full justify-items-center">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        width="200"
                        height="200"
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-100 dark:border-amber-800"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
                        <p className="text-amber-600 font-medium">{member.role}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Have questions or want to learn more? We'd love to hear from you.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 w-full max-w-6xl mx-auto justify-items-center">
              <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <Mail className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Get in touch with our team</p>
                  <a href="mailto:hello@lingualy.com" className="text-amber-600 hover:text-amber-700 font-medium">
                    hello@lingualy.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <Phone className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Speak with our support team</p>
                  <a href="tel:+1-555-123-4567" className="text-amber-600 hover:text-amber-700 font-medium">
                    +1 (555) 123-4567
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Visit Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Our headquarters</p>
                  <p className="text-amber-600 font-medium">
                    123 Education Ave
                    <br />
                    San Francisco, CA 94105
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Ready to Join Our Community?</h2>
              <p className="text-xl text-amber-100 leading-relaxed">
                Become part of a growing community of educators who are transforming their teaching with Lingualy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600 px-8 py-6 text-lg"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/lessons">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600 px-8 py-6 text-lg"
                  >
                    Explore Lessons
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-amber-400" />
                <span className="text-2xl font-bold">Lingualy</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                Empowering English educators worldwide with premium teaching resources and materials.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resources</h3>
              <div className="space-y-2">
                <Link
                  href="/lessons"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Lesson Plans
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Worksheets
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Assessments
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  ESL Materials
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <div className="space-y-2">
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Community
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal</h3>
              <div className="space-y-2">
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="block text-gray-400 dark:text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>© 2024 Lingualy. All rights reserved. Made with ❤️ for educators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
