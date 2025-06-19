"use client"

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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BackofficePage() {
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
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
          <Link href="/lessons" className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700">
            Browse Lessons
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700">
            Upgrade
          </Link>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Sarah J.</span>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah! 👋</h1>
              <p className="text-gray-600 mt-2">Ready to create amazing lessons today?</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Lesson
              </Button>
              <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
                <Search className="h-4 w-4 mr-2" />
                Search Resources
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
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
              <Card className="border-0 shadow-lg">
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
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Image
                        src={lesson.image || "/placeholder.svg"}
                        alt={lesson.title}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {lesson.grade}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lesson.subject}
                          </Badge>
                          <span className="text-xs text-gray-500">{lesson.lastAccessed}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{lesson.progress}% complete</span>
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
              <Card className="border-0 shadow-lg">
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
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          <Image
                            src={lesson.image || "/placeholder.svg"}
                            alt={lesson.title}
                            width={200}
                            height={120}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            {lesson.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                            {lesson.isPopular && <Badge className="bg-red-500 text-white">Popular</Badge>}
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {lesson.grade}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {lesson.subject}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
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
              <Card className="border-0 shadow-lg">
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
                  <div className="flex gap-2">
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Browse Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}
                      >
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{category.title}</h4>
                        <p className="text-xs text-gray-500">{category.count}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upgrade Prompt */}
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Unlock Premium</h3>
                  <p className="text-sm text-gray-600 mb-4">Get access to advanced features and unlimited downloads</p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
