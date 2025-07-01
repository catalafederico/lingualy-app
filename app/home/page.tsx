"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Search,
  BookOpen,
  Star,
  Download,
  Eye,
  ArrowRight,
  FileText,
  PenTool,
  MessageCircle,
  Clock,
  Heart,
  Filter,
  Bell,
  User,
  LogOut,
  Plus,
  History,
  Bookmark,
  TrendingUp,
  Calendar,
  Target,
  DollarSign,
  Book,
  Users,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  UserCog,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [language, setLanguage] = useState<"en" | "es">("en")

  // Initialize theme and language from localStorage on component mount
  useEffect(() => {
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
  }, [])

  // Internationalization text
  const t = {
    en: {
      goodMorning: "Good morning, Sarah! ☀️",
      whatToTeach: "What would you like to teach today?",
      searchPlaceholder: "Search for lesson plans, worksheets, activities...",
      search: "Search",
      selectGrade: "Select Grade Level",
      selectSubject: "Select Subject",
      moreFilters: "More Filters",
      recentSearches: "Recent Searches",
      getStarted: "Get Started",
      yourImpact: "Your Teaching Impact",
      trackProgress: "Track your progress and achievements",
      recommendedForYou: "Recommended for You",
      personalizedSuggestions: "Personalized suggestions based on your teaching preferences",
      quickBrowse: "Quick Browse",
      jumpToResources: "Jump to your favorite resource types",
      quickLinks: "Quick Links",
      browseAllLessons: "Browse All Lessons",
      viewAnalytics: "View Analytics",
      lessons: "Lessons",
      analytics: "Analytics",
      // Profile dropdown
      profile: "Profile", // Changed from editProfile: "Edit Profile"
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
      goodMorning: "¡Buenos días, Sarah! ☀️",
      whatToTeach: "¿Qué te gustaría enseñar hoy?",
      searchPlaceholder: "Buscar planes de lección, hojas de trabajo, actividades...",
      search: "Buscar",
      selectGrade: "Seleccionar Nivel de Grado",
      selectSubject: "Seleccionar Materia",
      moreFilters: "Más Filtros",
      recentSearches: "Búsquedas Recientes",
      getStarted: "Comenzar",
      yourImpact: "Tu Impacto Educativo",
      trackProgress: "Rastrea tu progreso y logros",
      recommendedForYou: "Recomendado para Ti",
      personalizedSuggestions: "Sugerencias personalizadas basadas en tus preferencias de enseñanza",
      quickBrowse: "Navegación Rápida",
      jumpToResources: "Salta a tus tipos de recursos favoritos",
      quickLinks: "Enlaces Rápidos",
      browseAllLessons: "Explorar Todas las Lecciones",
      viewAnalytics: "Ver Análisis",
      lessons: "Lecciones",
      analytics: "Análisis",
      // Profile dropdown
      profile: "Perfil", // Changed from editProfile: "Editar Perfil"
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

  const recentSearches = [
    "Creative writing prompts",
    "Shakespeare lesson plans",
    "ESL conversation activities",
    "Poetry analysis worksheets",
    "Grammar exercises grade 6",
  ]

  const quickActions = [
    {
      icon: Search,
      title: "Find Lesson Plans",
      description: "Search our library of 10,000+ lessons",
      color: "from-blue-500 to-cyan-500",
      action: "search",
    },
    {
      icon: Plus,
      title: "Create New Lesson",
      description: "Build a custom lesson plan",
      color: "from-green-500 to-emerald-500",
      action: "create",
    },
    {
      icon: Bookmark,
      title: "My Saved Resources",
      description: "Access your bookmarked content",
      color: "from-purple-500 to-violet-500",
      action: "saved",
    },
    {
      icon: Calendar,
      title: "Lesson Calendar",
      description: "Plan your teaching schedule",
      color: "from-orange-500 to-red-500",
      action: "calendar",
    },
  ]

  const personalStats = [
    { label: "Lessons Downloaded", value: "47", icon: Download, change: "+5 this week" },
    { label: "Hours Saved", value: "23", icon: Clock, change: "+3 this week" },
    { label: "Favorite Resources", value: "12", icon: Heart, change: "+2 this week" },
    { label: "Students Impacted", value: "156", icon: Target, change: "+12 this month" },
  ]

  const recommendedForYou = [
    {
      title: "Advanced Poetry Analysis Techniques",
      description: "Perfect for your upcoming Shakespeare unit",
      grade: "9-12",
      subject: "Literature",
      rating: 4.9,
      reason: "Based on your recent searches",
      image: "/placeholder.svg?height=120&width=200",
      isNew: false,
    },
    {
      title: "Creative Writing: Character Development",
      description: "Matches your teaching style preferences",
      grade: "6-8",
      subject: "Writing",
      rating: 4.8,
      reason: "Similar to your saved lessons",
      image: "/placeholder.svg?height=120&width=200",
      isNew: true,
    },
    {
      title: "ESL Grammar Fundamentals",
      description: "Trending in your grade level",
      grade: "Adult",
      subject: "ESL",
      rating: 4.7,
      reason: "Popular with teachers like you",
      image: "/placeholder.svg?height=120&width=200",
      isNew: false,
    },
  ]

  const resourceCategories = [
    {
      icon: BookOpen,
      title: "Lesson Plans",
      count: "2,340",
      description: "Ready-to-use lessons",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FileText,
      title: "Worksheets",
      count: "1,890",
      description: "Printable activities",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: PenTool,
      title: "Writing Tools",
      count: "567",
      description: "Prompts & exercises",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageCircle,
      title: "Discussion Guides",
      count: "423",
      description: "Conversation starters",
      color: "from-purple-500 to-violet-500",
    },
  ]

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
    // Here you would implement language switching logic
    // For example, updating localStorage or calling an API
    localStorage.setItem("language", newLanguage)
  }

  const handlePricingClick = () => {
    router.push("/pricing")
  }

  const handleEditProfileClick = () => {
    router.push("/profile")
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
              <DropdownMenuItem className="px-4 py-3 cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-3" />
                <span>{currentText.signOut}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="container space-y-8">
          {/* Welcome & Search Section */}
          <div className="text-center space-y-6 w-full">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">{currentText.goodMorning}</h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{currentText.whatToTeach}</p>
            </div>

            {/* Enhanced Search */}
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-amber-100 dark:border-amber-800">
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={currentText.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 h-12 sm:h-16 text-base sm:text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-amber-400 focus:ring-amber-400 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <Button className="absolute right-2 top-2 h-8 sm:h-12 px-3 sm:px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm sm:text-base">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      {currentText.search}
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="h-10 sm:h-12 border-gray-200 dark:border-gray-600 rounded-lg text-sm sm:text-base">
                        <SelectValue placeholder={currentText.selectGrade} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k-5">Elementary (K-5)</SelectItem>
                        <SelectItem value="6-8">Middle School (6-8)</SelectItem>
                        <SelectItem value="9-12">High School (9-12)</SelectItem>
                        <SelectItem value="adult">Adult/ESL</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="h-10 sm:h-12 border-gray-200 dark:border-gray-600 rounded-lg text-sm sm:text-base">
                        <SelectValue placeholder={currentText.selectSubject} />
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
                      className="h-10 sm:h-12 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm sm:text-base"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {currentText.moreFilters}
                    </Button>
                  </div>

                  {/* Recent Searches */}
                  <div className="text-center px-2">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-2">
                      <History className="h-4 w-4" />
                      {currentText.recentSearches}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl mx-auto justify-items-center">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{action.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">{action.description}</p>
                  <div className="flex items-center justify-center text-amber-600 font-medium group-hover:gap-3 gap-2 transition-all text-sm sm:text-base">
                    <span>{currentText.getStarted}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Personal Stats */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 w-full max-w-7xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                {currentText.yourImpact}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {currentText.trackProgress}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {personalStats.map((stat, index) => (
                  <div key={index} className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{stat.label}</div>
                    <div className="text-xs text-green-600">{stat.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3 w-full max-w-7xl mx-auto justify-items-center">
            {/* Recommended Resources */}
            <div className="lg:col-span-2 text-center w-full">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Star className="h-5 w-5 text-amber-600" />
                    {currentText.recommendedForYou}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {currentText.personalizedSuggestions}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {recommendedForYou.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <Image
                        src={resource.image || "/placeholder.svg"}
                        alt={resource.title}
                        width={80}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {resource.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                          <Badge variant="outline" className="text-xs">
                            {resource.grade}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.subject}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base">{resource.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{resource.rating}</span>
                          </div>
                          <span className="text-xs text-amber-600 font-medium">{resource.reason}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Resource Categories */}
            <div className="space-y-6 text-center w-full">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{currentText.quickBrowse}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {currentText.jumpToResources}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resourceCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}
                      >
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{category.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-bold text-amber-600">{category.count}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">available</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{currentText.quickLinks}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/lessons">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {currentText.browseAllLessons}
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {currentText.viewAnalytics}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
