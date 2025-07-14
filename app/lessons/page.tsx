"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import Navbar from "@/components/landing/Navbar"
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
  Plus,
  History,
  Bookmark,
  TrendingUp,
  Calendar,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth"
import { getUserProfile, type UserProfile } from "@/services/auth/user-profile"
import { getLessons, type LessonsResponse, type LessonQueryParams } from "@/services/lessons/get-lessons"
import { CEFR_LEVELS, LESSON_CATEGORIES } from "@/lib/constants"

export default function LessonsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [lessons, setLessons] = useState<LessonsResponse>({ lessons: [], total: 0, page: 1, limit: 6, totalPages: 0 })
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)

  const lessonsPerPage = 6

  // Function to fetch lessons from API
  const fetchLessons = async () => {
    setIsLoadingLessons(true)
    try {
      const params: LessonQueryParams = {
        page: currentPage,
        limit: lessonsPerPage,
        search: searchTerm || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        levels: selectedLevels.length > 0 ? selectedLevels : undefined,
      }
      
      const response = await getLessons(params)
      setLessons(response)
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      // Set empty state on error
      setLessons({ lessons: [], total: 0, page: 1, limit: lessonsPerPage, totalPages: 0 })
    } finally {
      setIsLoadingLessons(false)
    }
  }

  // Check authentication and initialize language on component mount
  useEffect(() => {
    const isAuth = checkIsAuthenticated()
    setIsAuthenticated(isAuth)

    // Initialize language
    const savedLanguage = localStorage.getItem("language") as "en" | "es" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Fetch user profile data only if authenticated
    const fetchUserProfile = async () => {
      if (isAuth) {
        try {
          const profile = await getUserProfile()
          setUserProfile(profile)
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          // Keep userProfile as null, will show fallback
        }
      }
    }

    fetchUserProfile()
    fetchLessons()
    setIsLoading(false)
  }, [router])

  // Fetch lessons when filters or pagination change
  useEffect(() => {
    fetchLessons()
  }, [currentPage, searchTerm, selectedLevels, selectedCategories])

  // Internationalization text
  const getUserName = () => {
    return userProfile?.firstName || "there"
  }

  const t = {
    en: {
      goodMorning: `Good morning, ${getUserName()}! ☀️`,
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
      goodMorning: `¡Buenos días, ${getUserName()}! ☀️`,
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


  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
      case "Pre-intermediate":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "Intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "Upper-intermediate":
        return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
      case "Advanced":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    }
  }

  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedLevels([...selectedLevels, level])
    } else {
      setSelectedLevels(selectedLevels.filter(l => l !== level))
    }
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedLevels([])
    setSelectedCategories([])
    setCurrentPage(1)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedLevels, selectedCategories])

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of lesson results
    document.querySelector('#lesson-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < lessons.totalPages) {
      goToPage(currentPage + 1)
    }
  }

  // Show loading screen while initializing
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isAuthenticated ? <AuthenticatedNavbar currentPage="lessons" /> : <Navbar />}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find Your Perfect Lesson</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Search through thousands of lesson plans and resources</p>
          </div>

          {/* Main Layout: Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Search & Filters */}
            <div className="lg:w-80 lg:flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="p-6 space-y-6">
                  {/* Search Bar */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Search Lessons</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search lessons, topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-amber-400 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Level Filters */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Levels</h3>
                    <div className="space-y-2">
                      {CEFR_LEVELS.map((level) => (
                        <div key={level.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`level-${level.value}`}
                            checked={selectedLevels.includes(level.value)}
                            onCheckedChange={(checked) => handleLevelChange(level.value, checked as boolean)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`level-${level.value}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {level.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Category</h3>
                    <div className="space-y-2">
                      {LESSON_CATEGORIES.map((category) => (
                        <div key={category.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.value}`}
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`category-${category.value}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {category.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="w-full border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>

                  {/* Results Summary */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lessons.total} lessons found
                    </p>
                    {lessons.totalPages > 1 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Page {currentPage} of {lessons.totalPages}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Lesson Results */}
            <div className="flex-1" id="lesson-results">
              {isLoadingLessons ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading lessons...
                  </p>
                </div>
              ) : lessons.lessons.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {lessons.lessons.map((lesson) => (
                    <Link href={`/lessons/${lesson.id}`} key={lesson.id} className="block group">
                      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white dark:bg-gray-800 cursor-pointer">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={lesson.coverImage?.publicUrl || "/placeholder.svg"}
                            alt={lesson.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className={getLevelColor(lesson.level)}>{lesson.level}</Badge>
                          </div>
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {lesson.isNew && (
                              <Badge className="bg-green-500 text-white">New</Badge>
                            )}
                            <Badge className={lesson.isPremium ? "bg-amber-500 text-white" : "bg-blue-500 text-white"}>
                              {lesson.isPremium ? "Premium" : "Free"}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {lesson.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {lesson.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
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

                          <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                            {lesson.tags?.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Go to lesson
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {lessons.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <div className="flex space-x-1">
                        {Array.from({ length: lessons.totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage = 
                            page === 1 || 
                            page === lessons.totalPages || 
                            Math.abs(page - currentPage) <= 1

                          if (!showPage && page === 2 && currentPage > 4) {
                            return (
                              <span key={page} className="px-2 py-1 text-gray-400">
                                ...
                              </span>
                            )
                          }

                          if (!showPage && page === lessons.totalPages - 1 && currentPage < lessons.totalPages - 3) {
                            return (
                              <span key={page} className="px-2 py-1 text-gray-400">
                                ...
                              </span>
                            )
                          }

                          if (!showPage) return null

                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                  : "border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              }
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === lessons.totalPages}
                        className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No lessons found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
