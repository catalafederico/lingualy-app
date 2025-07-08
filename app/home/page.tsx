"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
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

export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const lessonsPerPage = 6

  // Check authentication and initialize language on component mount
  useEffect(() => {
    if (!checkIsAuthenticated()) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)

    // Initialize language
    const savedLanguage = localStorage.getItem("language") as "en" | "es" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Keep userProfile as null, will show fallback
      }
    }

    fetchUserProfile()
    setIsLoading(false)
  }, [router])

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

  const allLessons = [
    {
      id: "1",
      title: "Creative Writing: Character Development",
      description: "Help students create compelling characters through guided exercises and prompts.",
      grade: "6-8",
      subject: "Writing",
      duration: "45 min",
      difficulty: "Intermediate",
      rating: 4.9,
      downloads: 2340,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Creative Writing", "Character", "Narrative"],
      isNew: true,
      isPremium: false,
    },
    {
      id: "2",
      title: "Shakespeare's Romeo and Juliet: Act 1 Analysis",
      description: "Comprehensive lesson plan for analyzing themes, characters, and language in Act 1.",
      grade: "9-12",
      subject: "Literature",
      duration: "60 min",
      difficulty: "Advanced",
      rating: 4.8,
      downloads: 1890,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Shakespeare", "Drama", "Analysis"],
      isNew: false,
      isPremium: true,
    },
    {
      id: "3",
      title: "ESL Conversation Starters: Daily Routines",
      description: "Interactive lesson to help ESL students practice talking about daily activities.",
      grade: "Adult",
      subject: "ESL",
      duration: "30 min",
      difficulty: "Beginner",
      rating: 4.7,
      downloads: 3120,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["ESL", "Conversation", "Daily Life"],
      isNew: false,
      isPremium: false,
    },
    {
      id: "4",
      title: "Poetry Analysis: Metaphors and Similes",
      description: "Teach students to identify and analyze figurative language in poetry.",
      grade: "4-6",
      subject: "Poetry",
      duration: "40 min",
      difficulty: "Intermediate",
      rating: 4.9,
      downloads: 2780,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Poetry", "Figurative Language", "Analysis"],
      isNew: false,
      isPremium: true,
    },
    {
      id: "5",
      title: "Persuasive Writing: Building Strong Arguments",
      description: "Step-by-step guide to help students construct compelling persuasive essays.",
      grade: "7-9",
      subject: "Writing",
      duration: "50 min",
      difficulty: "Intermediate",
      rating: 4.8,
      downloads: 2156,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Persuasive Writing", "Arguments", "Essays"],
      isNew: false,
      isPremium: false,
    },
    {
      id: "6",
      title: "Reading Comprehension: Main Ideas and Details",
      description: "Develop students' ability to identify main ideas and supporting details in texts.",
      grade: "3-5",
      subject: "Reading",
      duration: "35 min",
      difficulty: "Beginner",
      rating: 4.6,
      downloads: 4230,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Reading", "Comprehension", "Main Ideas"],
      isNew: false,
      isPremium: false,
    },
    {
      id: "7",
      title: "Advanced Grammar: Complex Sentences",
      description: "Master the art of writing complex sentences with proper punctuation and structure.",
      grade: "8-10",
      subject: "Grammar",
      duration: "55 min",
      difficulty: "Advanced",
      rating: 4.7,
      downloads: 1567,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Grammar", "Sentences", "Writing"],
      isNew: true,
      isPremium: false,
    },
    {
      id: "8",
      title: "Vocabulary Building Through Context Clues",
      description: "Teach students to decode unknown words using context and structural analysis.",
      grade: "5-7",
      subject: "Reading",
      duration: "40 min",
      difficulty: "Intermediate",
      rating: 4.6,
      downloads: 2890,
      preview: "/placeholder.svg?height=200&width=300",
      tags: ["Vocabulary", "Context Clues", "Reading"],
      isNew: false,
      isPremium: true,
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

  const handleGradeChange = (grade: string, checked: boolean) => {
    if (checked) {
      setSelectedGrades([...selectedGrades, grade])
    } else {
      setSelectedGrades(selectedGrades.filter(g => g !== grade))
    }
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subject])
    } else {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
    }
  }

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    if (checked) {
      setSelectedDifficulties([...selectedDifficulties, difficulty])
    } else {
      setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty))
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedGrades([])
    setSelectedSubjects([])
    setSelectedDifficulties([])
    setCurrentPage(1)
  }

  const filteredLessons = allLessons.filter((lesson) => {
    const matchesSearch = searchTerm === "" || 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(lesson.grade)
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(lesson.subject)
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(lesson.difficulty)
    
    return matchesSearch && matchesGrade && matchesSubject && matchesDifficulty
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage)
  const startIndex = (currentPage - 1) * lessonsPerPage
  const endIndex = startIndex + lessonsPerPage
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedGrades, selectedSubjects, selectedDifficulties])

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
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedNavbar currentPage="home" />

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

                  {/* Grade Level Filters */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Grade Level</h3>
                    <div className="space-y-2">
                      {["3-5", "4-6", "5-7", "6-8", "7-9", "8-10", "9-12", "Adult"].map((grade) => (
                        <div key={grade} className="flex items-center space-x-2">
                          <Checkbox
                            id={`grade-${grade}`}
                            checked={selectedGrades.includes(grade)}
                            onCheckedChange={(checked) => handleGradeChange(grade, checked as boolean)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`grade-${grade}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {grade === "Adult" ? "Adult/ESL" : `Grade ${grade}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject Filters */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Subject</h3>
                    <div className="space-y-2">
                      {["Reading", "Writing", "Grammar", "Literature", "Poetry", "ESL"].map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`subject-${subject}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {subject}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filters */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Difficulty</h3>
                    <div className="space-y-2">
                      {["Beginner", "Intermediate", "Advanced"].map((difficulty) => (
                        <div key={difficulty} className="flex items-center space-x-2">
                          <Checkbox
                            id={`difficulty-${difficulty}`}
                            checked={selectedDifficulties.includes(difficulty)}
                            onCheckedChange={(checked) => handleDifficultyChange(difficulty, checked as boolean)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`difficulty-${difficulty}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {difficulty}
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
                      {filteredLessons.length} lessons found
                    </p>
                    {totalPages > 1 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Page {currentPage} of {totalPages}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Lesson Results */}
            <div className="flex-1" id="lesson-results">
              {filteredLessons.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedLessons.map((lesson, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-gray-800"
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={lesson.preview || "/placeholder.svg"}
                          alt={lesson.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
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
                              Preview
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

                  {/* Pagination */}
                  {totalPages > 1 && (
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage = 
                            page === 1 || 
                            page === totalPages || 
                            Math.abs(page - currentPage) <= 1

                          if (!showPage && page === 2 && currentPage > 4) {
                            return (
                              <span key={page} className="px-2 py-1 text-gray-400">
                                ...
                              </span>
                            )
                          }

                          if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
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
                        disabled={currentPage === totalPages}
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
