"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import Link from "next/link"

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  // Initialize theme from localStorage on component mount
  useEffect(() => {
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
  }, [])

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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
          <Link href="/lessons" className="text-sm font-medium text-amber-600 transition-colors">
            Lessons
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:text-amber-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            Login
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
              Get Started
            </Button>
          </Link>
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
                  <Button className="absolute right-2 top-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
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
                  className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Lessons */}
        <section className="w-full py-20 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-gray-100">
                Featured Lesson Plans
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Hand-picked lessons from our most popular and highly-rated content
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredLessons.map((lesson, index) => (
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Load More Lessons
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
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
                    variant="secondary"
                    className="bg-white text-amber-600 hover:bg-gray-100 shadow-lg px-8 py-6 text-lg"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
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
