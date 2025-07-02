"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Star,
  Download,
  Eye,
  ArrowLeft,
  Users,
  Target,
  FileText,
  PlayCircle,
  CheckCircle,
  Share2,
  Heart,
  Bookmark,
  Printer,
  Calendar,
  Award,
  Lightbulb,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"

// Mock lesson data - in a real app, this would come from an API
const getLessonById = (id: string) => {
  const lessons = [
    {
      id: "1",
      title: "Creative Writing: Character Development",
      description: "Help students create compelling characters through guided exercises and prompts.",
      fullDescription: "This comprehensive lesson plan guides students through the essential process of character development in creative writing. Students will learn to create multi-dimensional characters that drive compelling narratives through a series of scaffolded activities and reflective exercises.",
      grade: "6-8",
      subject: "Writing",
      duration: "45 min",
      difficulty: "Intermediate",
      rating: 4.9,
      downloads: 2340,
      preview: "/placeholder.svg?height=400&width=600",
      tags: ["Creative Writing", "Character", "Narrative"],
      isNew: true,
      isPremium: false,
      objectives: [
        "Students will identify the key elements of character development",
        "Students will create detailed character profiles using guided templates",
        "Students will demonstrate understanding of character motivation and conflict",
        "Students will apply character development techniques in their own writing"
      ],
      materials: [
        "Character development worksheet",
        "Sample character profiles",
        "Writing prompts handout",
        "Peer evaluation rubric",
        "Whiteboard or chart paper",
        "Colored pencils or markers"
      ],
      procedures: [
        {
          title: "Warm-up Activity",
          duration: "5 minutes",
          description: "Students brainstorm their favorite fictional characters and what makes them memorable."
        },
        {
          title: "Introduction to Character Elements",
          duration: "10 minutes",
          description: "Teacher introduces the five key elements of character development: appearance, personality, background, motivation, and conflict."
        },
        {
          title: "Character Profile Creation",
          duration: "20 minutes",
          description: "Students work individually to create detailed character profiles using the provided template."
        },
        {
          title: "Peer Sharing and Feedback",
          duration: "8 minutes",
          description: "Students share their characters in pairs and provide constructive feedback."
        },
        {
          title: "Wrap-up and Assignment",
          duration: "2 minutes",
          description: "Review key concepts and assign character development homework."
        }
      ],
      assessment: [
        "Character profile completeness and creativity",
        "Demonstration of understanding through peer feedback",
        "Quality of questions asked during discussion",
        "Application of concepts in follow-up writing assignment"
      ],
      extensions: [
        "Create a character backstory timeline",
        "Write a short scene featuring your character",
        "Design a character mood board",
        "Interview your character activity"
      ],
      standards: [
        "CCSS.ELA-LITERACY.W.6.3: Write narratives to develop real or imagined experiences",
        "CCSS.ELA-LITERACY.W.7.3: Write narratives to develop real or imagined experiences",
        "CCSS.ELA-LITERACY.SL.6.1: Engage effectively in collaborative discussions"
      ],
      author: "Sarah Martinez",
      authorTitle: "Middle School English Teacher",
      schoolDistrict: "Lincoln Unified School District",
      lastUpdated: "2024-06-15",
      downloadFiles: [
        { name: "Lesson Plan PDF", type: "pdf", size: "2.4 MB" },
        { name: "Character Worksheet", type: "docx", size: "1.1 MB" },
        { name: "Sample Characters", type: "pdf", size: "856 KB" },
        { name: "Assessment Rubric", type: "docx", size: "432 KB" }
      ]
    }
  ]
  
  return lessons.find(lesson => lesson.id === id)
}

export default function LessonDetailPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string
  const [lesson, setLesson] = useState<any>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)

    // Load lesson data
    const lessonData = getLessonById(lessonId)
    if (!lessonData) {
      router.push("/home")
      return
    }
    setLesson(lessonData)
    setIsLoading(false)
  }, [lessonId, router])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedNavbar currentPage="lessons" />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lessons
            </Button>
          </div>

          {/* Lesson Header */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={lesson.preview || "/placeholder.svg"}
                    alt={lesson.title}
                    className="w-full h-64 object-cover"
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

                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline">{lesson.grade}</Badge>
                    <Badge variant="outline">{lesson.subject}</Badge>
                    {lesson.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">
                    {lesson.title}
                  </CardTitle>
                  
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    {lesson.fullDescription}
                  </CardDescription>

                  {/* Stats Row */}
                  <div className="flex items-center gap-6 pt-4 text-sm text-gray-600 dark:text-gray-400">
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
                      <span>{lesson.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Grade {lesson.grade}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Lesson Content Tabs */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="procedures">Procedures</TabsTrigger>
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                      <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6 mt-6">
                      {/* Learning Objectives */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5 text-amber-600" />
                          Learning Objectives
                        </h3>
                        <ul className="space-y-2">
                          {lesson.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      {/* Standards Alignment */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          Standards Alignment
                        </h3>
                        <ul className="space-y-2">
                          {lesson.standards.map((standard, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              {standard}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      {/* Extensions */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-amber-600" />
                          Extension Activities
                        </h3>
                        <ul className="space-y-2">
                          {lesson.extensions.map((extension, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{extension}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="procedures" className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-amber-600" />
                        Lesson Procedures
                      </h3>
                      {lesson.procedures.map((step, index) => (
                        <Card key={index} className="border border-gray-200 dark:border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{step.title}</h4>
                                <p className="text-sm text-amber-600 dark:text-amber-400">{step.duration}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 ml-11">{step.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="materials" className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-600" />
                        Required Materials
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {lesson.materials.map((material, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{material}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assessment" className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-amber-600" />
                        Assessment Criteria
                      </h3>
                      <ul className="space-y-3">
                        {lesson.assessment.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                              {index + 1}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download Lesson
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                      <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Version
                  </Button>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About the Author</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{lesson.author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.authorTitle}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.schoolDistrict}</p>
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Last updated: {new Date(lesson.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Files */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Download Files</h3>
                  <div className="space-y-3">
                    {lesson.downloadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{file.type.toUpperCase()} • {file.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}