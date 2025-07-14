"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  UserCog,
  DollarSign,
  Book,
  Users,
  HelpCircle,
  Sun,
  Moon,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { logoutUser } from "@/services/auth/logout"
import { getUserProfile, type UserProfile } from "@/services/auth/user-profile"

interface AuthenticatedNavbarProps {
  currentPage?: 'home' | 'lessons' | 'pricing' | 'about' | 'profile' | 'backoffice'
}

export default function AuthenticatedNavbar({ currentPage = 'home' }: AuthenticatedNavbarProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Initialize theme and language on component mount
  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true)
    
    // Initialize theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      // Apply theme immediately to avoid flash
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    // Initialize language
    const savedLanguage = localStorage.getItem("language") as "en" | "es" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        setIsLoadingUser(true)
        const profile = await getUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Keep userProfile as null, will show fallback
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLanguageChange = (newLanguage: "en" | "es") => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const handleEditProfileClick = () => {
    router.push("/profile")
  }

  const handleSignOut = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always redirect to landing page regardless of API call result
      router.push("/")
    }
  }

  // Internationalization text
  const t = {
    en: {
      home: "Home",
      lessons: "Lessons",
      analytics: "Analytics",
      profile: "Profile",
      pricing: "Pricing",
      about: "About",
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
      home: "Inicio",
      lessons: "Lecciones",
      analytics: "Análisis",
      profile: "Perfil",
      pricing: "Precios",
      about: "Acerca de",
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
        <Link
          href="/lessons"
          className={`text-sm font-medium hover:text-amber-600 transition-colors ${
            currentPage === 'lessons' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {currentText.lessons}
        </Link>
        <Link
          href="/pricing"
          className={`text-sm font-medium hover:text-amber-600 transition-colors ${
            currentPage === 'pricing' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {currentText.pricing}
        </Link>
        <Link
          href="/about"
          className={`text-sm font-medium hover:text-amber-600 transition-colors ${
            currentPage === 'about' 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {currentText.about}
        </Link>
        
        {/* Admin Backoffice Link */}
        {isClient && isAdmin() && (
          <Link
            href="/backoffice"
            className={`text-sm font-medium hover:text-amber-600 transition-colors flex items-center gap-1 ${
              currentPage === 'backoffice' 
                ? 'text-amber-600 dark:text-amber-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4" />
            Backoffice
          </Link>
        )}
        
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isLoadingUser ? 'Loading...' : userProfile ? `${userProfile.firstName} ${userProfile.lastName?.[0]}.` : 'User'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end">
            {/* User Info */}
            <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isLoadingUser ? 'Loading...' : userProfile?.email || 'No email available'}
                </p>
                {isClient && isAdmin() && (
                  <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs">
                    <Shield className="h-3 w-3" />
                    Admin
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <DropdownMenuItem className="px-4 py-3 cursor-pointer" onClick={handleEditProfileClick}>
                <UserCog className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>{currentText.profile}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                <Book className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>{currentText.documentation}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                <Users className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>{currentText.communityForum}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                <HelpCircle className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>{currentText.feedback}</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Preferences */}
            <div className="px-4 py-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {currentText.preferences}
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{currentText.theme}</span>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${theme === "light" ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${theme === "dark" ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{currentText.language}</span>
                <Select value={language} onValueChange={(value: "en" | "es") => handleLanguageChange(value)}>
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{currentText.english}</SelectItem>
                    <SelectItem value="es">{currentText.spanish}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Sign Out */}
            <DropdownMenuItem className="px-4 py-3 cursor-pointer text-red-600 focus:text-red-600" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-3" />
              <span>{currentText.signOut}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}