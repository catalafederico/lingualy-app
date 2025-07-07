"use client"

import { useState, useEffect } from "react"
import "./backoffice.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  BookOpen,
  Download,
  Star,
  Search,
  Plus,
  Clock,
  Users,
  Award,
  FileText,
  PenTool,
  MessageCircle,
  Eye,
  Heart,
  Filter,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export default function BackofficePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Check authentication
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)

    // Check for success message
    const created = searchParams.get("created") === "true"
    const published = searchParams.get("published") === "true"
    if (created || published) {
      setShowSuccessMessage(true)
      // Remove the query parameter from URL after showing message
      router.replace("/backoffice")
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [router, searchParams])

  const recentLessons = [
    {
      title: "Creative Writing: Character Development",
      subject: "Writing",
      grade: "6-8",
      lastAccessed: "2 hours ago",
      progress: 85,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      title: "Shakespeare's Romeo and Juliet",
      subject: "Literature",
      grade: "9-12",
      lastAccessed: "1 day ago",
      progress: 60,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      title: "ESL Conversation Starters",
      subject: "ESL",
      grade: "Adult",
      lastAccessed: "3 days ago",
      progress: 100,
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const quickStats = [
    { label: "Lessons Downloaded", value: "47", icon: Download, color: "text-blue-600" },
    { label: "Hours Saved", value: "23", icon: Clock, color: "text-green-600" },
    { label: "Favorite Lessons", value: "12", icon: Heart, color: "text-red-600" },
    { label: "Students Reached", value: "156", icon: Users, color: "text-purple-600" },
  ]

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

  const featuredLessons = [
    {
      title: "Poetry Analysis: Metaphors and Similes",
      description: "Teach students to identify and analyze figurative language in poetry.",
      grade: "4-6",
      subject: "Poetry",
      rating: 4.9,
      downloads: 2780,
      image: "/placeholder.svg?height=120&width=200",
      isNew: true,
    },
    {
      title: "Persuasive Writing: Building Strong Arguments",
      description: "Step-by-step guide to help students construct compelling persuasive essays.",
      grade: "7-9",
      subject: "Writing",
      rating: 4.8,
      downloads: 2156,
      image: "/placeholder.svg?height=120&width=200",
      isPopular: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-amber-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Lingualy
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/lessons"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              Browse Lessons
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              Upgrade
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">Sarah J.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                {searchParams.get("published") === "true" ? "Lesson Published Successfully!" : "Lesson Created Successfully!"}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                {searchParams.get("published") === "true" 
                  ? "Your lesson has been published and is now live for students."
                  : "Your new lesson has been saved as a draft."
                }
              </p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, Sarah! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Ready to create amazing lessons today?</p>
          </div>
          <div className="flex gap-3">
            <Link href="/backoffice/create-lesson">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Lesson
              </Button>
            </Link>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20">
              <Search className="h-4 w-4 mr-2" />
              Search Resources
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="w-15 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{lesson.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {lesson.grade}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lesson.subject}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.lastAccessed}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lesson.progress}% complete</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Lessons */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  Featured This Week
                </CardTitle>
                <CardDescription>Hand-picked lessons just for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredLessons.map((lesson, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-200 dark:bg-gray-700 h-32 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                        <div className="absolute top-2 right-2">
                          {lesson.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                          {lesson.isPopular && <Badge className="bg-red-500 text-white text-xs">Popular</Badge>}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{lesson.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{lesson.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {lesson.grade}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lesson.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lesson.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Categories */}
          <div className="space-y-8">
            {/* Quick Search */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Quick Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search lessons, topics..."
                    className="pl-10 border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Grade 6-8
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Writing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Browse Categories */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Browse Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}
                    >
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{category.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{category.count}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Unlock Premium</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get access to advanced features and unlimited downloads
                </p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}