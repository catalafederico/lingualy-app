"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-700">
      <Link href="/" className="flex items-center justify-center">
        <div className="relative">
          <Sparkles className="h-10 w-10 text-amber-600" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
        <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Lingualy
        </span>
      </Link>
      <nav className="ml-auto flex gap-6 items-center">
        <ThemeToggle />
        {[
          { href: "/lessons", label: "Lessons" },
          { href: "/pricing", label: "Pricing" },
          { href: "/about", label: "About" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/login">
          <Button 
            variant="outline" 
            className="border-amber-300 dark:border-amber-600 text-white hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
          >
            Login
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            Sign Up
          </Button>
        </Link>
      </nav>
    </header>
  )
}