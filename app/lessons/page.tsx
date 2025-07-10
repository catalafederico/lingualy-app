"use client"

import { useState, useEffect } from "react"
import { getLessons, type Lesson, type LessonsResponse } from "@/services/lessons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Search,
  BookOpen,
  Clock,
  Star,
  Download,
  Eye,
  Filter,
  ArrowRight,
  FileText,
  PenTool,
  MessageCircle,
  Bell,
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LessonsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [lessonsData, setLessonsData] = useState<LessonsResponse | null>(null)
  const [loadingLessons, setLoadingLessons] = useState(false)

  // Initialize theme, language, and check authentication on component mount
  useEffect(() => {
    // Check authentication first
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)

    // Initialize theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initialTheme = prefersDark ? "dark" : "light"
      setTheme(initialTheme)
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark")
      }
      localStorage.setItem("theme", initialTheme)
    }

    // Initialize language
    const savedLanguage = localStorage.getItem("language") as "en" | "es" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    setIsLoading(false)
    
    // Load initial lessons
    loadLessons()
  }, [router])

  const loadLessons = async () => {
    setLoadingLessons(true)
    try {
      const params = {
        page: 1,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedGrade && { grade: selectedGrade }),
        ...(selectedSubject && { subject: selectedSubject }),
      }
      const data = await getLessons(params)
      setLessonsData(data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoadingLessons(false)
    }
  }

  const handleSearch = () => {
    loadLessons()
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedGrade("")
    setSelectedSubject("")
    loadFeaturedLessons()
  }

  // Handler functions
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

  const handlePricingClick = () => {
    router.push("/pricing")
  }

  const handleEditProfileClick = () => {
    router.push("/profile")
  }

  const handleSignOut = () => {
    localStorage.removeItem("accessToken")
    router.push("/login")
  }

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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const categories = [
    {
      icon: BookOpen,
      title: "Reading Comprehension",
      count: "1,200+ lessons",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: PenTool,
      title: "Writing Skills",
      count: "800+ lessons",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: MessageCircle,
      title: "Speaking & Listening",
      count: "600+ lessons",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: FileText,
      title: "Grammar & Vocabulary",
      count: "1,500+ lessons",
      color: "from-amber-500 to-yellow-500",
    },
  ]


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-700">
        <Link href="/home" className="flex items-center justify-center">
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
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            {currentText.lessons}
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            {currentText.analytics}
          </Link>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sarah J.</span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end">
              {/* User Info */}
              <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">sarah.johnson@school.edu</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <DropdownMenuItem className="px-4 py-3 cursor-pointer" onClick={handleEditProfileClick}>
                  <UserCog className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>{currentText.profile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 cursor-pointer" onClick={handlePricingClick}>
                  <DollarSign className="h-4 w-4 mr-3 text-amber-600 dark:text-amber-400" />
                  <span>{currentText.pricing}</span>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700">
                10,000+ Lesson Plans
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-gray-100">
                Discover Amazing
                <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Lesson Plans
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Explore our comprehensive library of expertly crafted lesson plans, worksheets, and teaching resources
                designed to engage students and save you time.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search lesson plans, topics, or grade levels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-14 text-lg border-2 border-amber-200 dark:border-amber-700 focus:border-amber-400 focus:ring-amber-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-900 dark:text-gray-100"
                  />
                  <Button 
                    onClick={handleSearch}
                    className="absolute right-2 top-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find the perfect lesson plans organized by subject area and teaching focus
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 cursor-pointer bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{category.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{category.count}</p>
                    <div className="flex items-center justify-center text-amber-600 font-medium group-hover:gap-3 gap-2 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Filter Lessons:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700">
                    <SelectValue placeholder="Grade Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="k-2">K-2</SelectItem>
                    <SelectItem value="3-5">3-5</SelectItem>
                    <SelectItem value="6-8">6-8</SelectItem>
                    <SelectItem value="9-12">9-12</SelectItem>
                    <SelectItem value="adult">Adult/ESL</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700">
                    <SelectValue placeholder="Subject Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="poetry">Poetry</SelectItem>
                    <SelectItem value="esl">ESL</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Section */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                {lessonsData ? 'Search Results' : 'Featured Lesson Plans'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {lessonsData 
                  ? `Found ${lessonsData.total} lessons matching your criteria`
                  : 'Hand-picked lessons from our most popular and highly-rated content'
                }
              </p>
            </div>

            {loadingLessons && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Loading lessons...</span>
                </div>
              </div>
            )}

            {!loadingLessons && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(lessonsData?.lessons || []).map((lesson, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-gray-800"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={lesson.previewImage || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {lesson.grade}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.subject}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">{lesson.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{lesson.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{lesson.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {lesson.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/lessons/${lesson.id}`} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

            {!loadingLessons && (lessonsData?.lessons || []).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No lessons found matching your criteria.</p>
              </div>
            )}

            {!loadingLessons && !lessonsData && (
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={loadLessons}
                  className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  Browse All Lessons
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600"></div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Ready to Access All Lessons?</h2>
              <p className="text-xl text-amber-100 leading-relaxed">
                Join thousands of teachers who save hours every week with our comprehensive lesson library.
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
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600 px-8 py-6 text-lg"
                  >
                    View Pricing
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
