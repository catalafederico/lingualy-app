"use client"

import { useState, useEffect } from "react"
import { getLessonById, downloadFile, rateLesson, acquireLesson, createLessonCheckout, type Lesson } from "@/services/lessons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
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
  Calendar,
  Award,
  Lightbulb,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"


export default function LessonDetailPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
  const [userRating, setUserRating] = useState<number>(0)
  const [isRatingLoading, setIsRatingLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [isAcquiring, setIsAcquiring] = useState(false)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  useEffect(() => {
    // Check authentication
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)

    // Load lesson data
    loadLesson()
  }, [lessonId, router])

  const loadLesson = async () => {
    try {
      const lessonData = await getLessonById(parseInt(lessonId))
      // Ensure arrays are never undefined to prevent map errors
      const safeLesson = {
        ...lessonData,
        tags: lessonData.tags || [],
        objectives: lessonData.objectives || [],
        materials: lessonData.materials || [],
        procedures: lessonData.procedures || [],
        assessment: lessonData.assessment || [],
        activities: lessonData.activities || [], // Will be empty array if backend doesn't return activities
        downloadFiles: lessonData.downloadFiles || [],
      }
      setLesson(safeLesson)
    } catch (error) {
      console.error('Error loading lesson:', error)
      setError('Failed to load lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (rating: number) => {
    if (!lesson || isRatingLoading) return
    
    // Check if user can rate this lesson
    if (lesson.accessStatus && !lesson.accessStatus.canRate) {
      toast.error('You need to acquire this lesson or have a subscription to rate it.')
      return
    }
    
    try {
      setIsRatingLoading(true)
      await rateLesson(lesson.id, rating)
      // Only update user rating, not the lesson's overall rating
      setUserRating(rating)
      toast.success('Thank you for rating this lesson!')
    } catch (error) {
      console.error('Error rating lesson:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setIsRatingLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      const lessonUrl = `${window.location.origin}/lessons/${lessonId}`
      await navigator.clipboard.writeText(lessonUrl)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy link')
    }
  }

  const handleFileDownload = async (file: any) => {
    try {
      setDownloadingFileId(file.id)
      let downloadUrl: string
      
      // If file has publicUrl, use it directly
      if (file.publicUrl) {
        downloadUrl = file.publicUrl
      } else if (file.id) {
        // Otherwise, get signed URL from API if file ID exists
        downloadUrl = await downloadFile(lesson!.id, file.id)
      } else {
        throw new Error('File cannot be downloaded - no URL or ID available')
      }
      
      // Download the file using fetch and blob for better cross-origin support
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create a temporary link and trigger download
      const fileName = file.displayName || file.originalName || 'download'
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
      // Show error message to user
      alert('Failed to download file. Please try again later.')
    } finally {
      setDownloadingFileId(null)
    }
  }

  const handleAcquireLesson = async () => {
    if (!lesson) return
    
    try {
      setIsAcquiring(true)
      await acquireLesson(lesson.id)
      toast.success('Lesson acquired successfully!')
      // Reload lesson to get updated access status
      await loadLesson()
    } catch (error: any) {
      console.error('Error acquiring lesson:', error)
      toast.error(error.message || 'Failed to acquire lesson. Please try again.')
    } finally {
      setIsAcquiring(false)
    }
  }

  const handleBuyLesson = async () => {
    if (!lesson) return
    
    try {
      setIsCreatingCheckout(true)
      const checkout = await createLessonCheckout(lesson.id)
      // Redirect to Stripe checkout
      window.location.href = checkout.url
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      toast.error(error.message || 'Failed to create checkout. Please try again.')
      setIsCreatingCheckout(false)
    }
  }

  const handleSubscribeNow = () => {
    router.push('/pricing')
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500 dark:bg-green-600 text-white"
      case "Pre-intermediate":
        return "bg-blue-500 dark:bg-blue-600 text-white"
      case "Intermediate":
        return "bg-yellow-500 dark:bg-yellow-600 text-white"
      case "Upper-intermediate":
        return "bg-orange-500 dark:bg-orange-600 text-white"
      case "Advanced":
        return "bg-red-500 dark:bg-red-600 text-white"
      default:
        return "bg-gray-500 dark:bg-gray-600 text-white"
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
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
        <div className="max-w-6xl mx-auto space-y-6" data-lesson-content>
          {/* Back Button */}
          <div className="flex items-center gap-4 -ml-8">
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
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 lesson-header">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={lesson.coverImage?.publicUrl || "/placeholder.svg"}
                    alt={lesson.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getLevelColor(lesson.level)}>
                      {lesson.level}
                    </Badge>
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
                    <Badge variant="outline">{lesson.level}</Badge>
                    <Badge variant="outline">{lesson.category}</Badge>
                  </div>
                  
                  <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between gap-4">
                      <span>{lesson.title}</span>
                      {lesson.isPremium && lesson.creditCost > 0 && (
                        <Badge className="bg-purple-500 text-white text-sm shrink-0">
                          {lesson.creditCost} {lesson.creditCost === 1 ? 'Credit' : 'Credits'}
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    {lesson.fullDescription && lesson.fullDescription.length > 200 ? (
                      <>
                        {showFullDescription 
                          ? lesson.fullDescription 
                          : `${lesson.fullDescription.substring(0, 200)}...`
                        }
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="ml-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline focus:outline-none"
                        >
                          {showFullDescription ? "See less" : "See more"}
                        </button>
                      </>
                    ) : (
                      lesson.fullDescription
                    )}
                  </CardDescription>

                  {/* Tags */}
                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {lesson.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

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
                      <span>Level {lesson.level}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Access Control */}
              {lesson.isPremium && lesson.accessStatus && !lesson.accessStatus.hasAccess && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <Lightbulb className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">Premium Content</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      This premium lesson contains exclusive content. To access the full lesson including procedures, materials, assessment and downloadable files, you need to acquire it.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      {lesson.accessStatus.canAffordWithCredits ? (
                        <Button 
                          onClick={handleAcquireLesson}
                          disabled={isAcquiring}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isAcquiring ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Acquiring...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Acquire with {lesson.accessStatus.creditCost} Credits
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleBuyLesson}
                          disabled={isCreatingCheckout}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isCreatingCheckout ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating Checkout...
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Buy Lesson for ${lesson.accessStatus.lessonPrice}
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button 
                        onClick={handleSubscribeNow}
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Subscribe Now
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>🪙 Your Credits: {lesson.accessStatus.userCredits}</p>
                      <p>📚 Lesson Cost: {lesson.accessStatus.creditCost} credits</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Content Tabs - Only show if not a locked premium lesson */}
              {!(lesson.isPremium && lesson.accessStatus && !lesson.accessStatus.hasAccess) && (
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="procedures">Procedures</TabsTrigger>
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                      <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6 mt-6" data-tab="overview">
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

                      {/* Lesson Activities */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          Skills & Activities
                        </h3>
                        <div className="space-y-3">
                          {lesson.activities && lesson.activities.length > 0 ? (
                            lesson.activities.map((activity, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                    {activity.skill.charAt(0)}
                                  </div>
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{activity.skill}</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm ml-8">{activity.description}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              <p>No activities available for this lesson.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="procedures" className="space-y-4 mt-6" data-tab="procedures">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-amber-600" />
                        Lesson Procedures
                      </h3>
                      {lesson.procedures.map((step, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
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
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="materials" className="space-y-4 mt-6" data-tab="materials">
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
                    
                    <TabsContent value="assessment" className="space-y-4 mt-6" data-tab="assessment">
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
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6 space-y-4">
                  {/* User Rating Section - Separate from lesson's overall rating */}
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rate this lesson</h3>
                    
                    {/* Check if user can rate */}
                    {lesson.accessStatus && !lesson.accessStatus.canRate ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className="h-8 w-8 text-gray-300 dark:text-gray-600 opacity-50"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          🔒 Acquire this lesson to rate it
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            disabled={isRatingLoading}
                            className="p-1 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Star 
                              className={`h-8 w-8 transition-colors duration-200 ${
                                star <= (hoveredRating || userRating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {userRating > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You rated this lesson {userRating} star{userRating !== 1 ? 's' : ''}
                      </p>
                    )}
                    {isRatingLoading && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Submitting rating...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)} className="bookmark-button">
                      <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="share-button">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About the Author</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {lesson.author.firstName} {lesson.author.lastName}
                      </p>
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Files - Only show if not a locked premium lesson */}
              {lesson.downloadFiles && lesson.downloadFiles.length > 0 && !(lesson.isPremium && lesson.accessStatus && !lesson.accessStatus.hasAccess) && (
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Download Files</h3>
                    <div className="space-y-3">
                      {lesson.downloadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.displayName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{file.extension.toUpperCase()} • {file.sizeInBytes > 1024 * 1024 ? (file.sizeInBytes / (1024 * 1024)).toFixed(1) + 'MB' : (file.sizeInBytes / 1024).toFixed(1) + 'KB'}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleFileDownload(file)}
                          disabled={downloadingFileId === file.id}
                        >
                          {downloadingFileId === file.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                          ) : (
                            <Download className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}