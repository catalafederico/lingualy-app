"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Testimonials from "@/components/landing/Testimonials"
import CTA from "@/components/landing/CTA"
import Footer from "@/components/landing/Footer"
import Navbar from "@/components/landing/Navbar"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { isAuthenticated } from "@/lib/auth"

export default function LingualyLanding() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    setIsAuth(isAuthenticated())
    setIsLoading(false)

    // Initialize theme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) document.documentElement.classList.add("dark")
    }
  }, [])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isAuth ? <AuthenticatedNavbar currentPage="home" /> : <Navbar />}
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
