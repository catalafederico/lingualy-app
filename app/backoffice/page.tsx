"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { getDraftLessons, deleteLesson } from "@/services/lessons/create-lesson"
import { Lesson } from "@/services/lessons/get-lessons"
import { toast } from "sonner"
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
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Calendar,
  Globe,
  Shield,
  Settings,
  User,
  Bell,
  LogOut,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { isAdmin as checkIsAdmin, isAuthenticated as checkIsAuthenticated } from "@/lib/auth"

// Mock admin stats data
const adminStats = [
  { 
    label: "Total Lessons", 
    value: "1,247", 
    change: "+12%", 
    icon: BookOpen, 
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  { 
    label: "Published This Month", 
    value: "89", 
    change: "+23%", 
    icon: Globe, 
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  { 
    label: "Total Downloads", 
    value: "45.2K", 
    change: "+8%", 
    icon: Download, 
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  { 
    label: "Active Users", 
    value: "3,156", 
    change: "+15%", 
    icon: Users, 
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20"
  },
]

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Less than an hour ago'
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
}

// Mock recent activity data
const recentActivity = [
  {
    type: "publish",
    lesson: "Poetry Analysis: Metaphors and Similes",
    user: "Sarah Johnson",
    time: "2 hours ago",
    icon: Globe,
    color: "text-green-600"
  },
  {
    type: "create",
    lesson: "ESL Conversation Practice: Job Interviews",
    user: "Michael Chen", 
    time: "4 hours ago",
    icon: Plus,
    color: "text-blue-600"
  },
  {
    type: "edit",
    lesson: "Shakespeare's Romeo and Juliet: Act 2",
    user: "Elena Rodriguez",
    time: "6 hours ago", 
    icon: Edit,
    color: "text-amber-600"
  },
  {
    type: "delete",
    lesson: "Outdated Grammar Rules",
    user: "David Thompson",
    time: "1 day ago",
    icon: Trash2,
    color: "text-red-600"
  },
]

export default function BackofficeAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")
  const [draftLessons, setDraftLessons] = useState<Lesson[]>([])
  const [isDraftLoading, setIsDraftLoading] = useState(false)
  const [draftError, setDraftError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; lessonId: number | null; lessonTitle: string }>({
    isOpen: false,
    lessonId: null,
    lessonTitle: ""
  })

  useEffect(() => {
    // Check authentication
    if (!checkIsAuthenticated()) {
      router.push("/login")
      return
    }

    // Check admin privileges (only admins can access backoffice)
    if (!checkIsAdmin()) {
      // Redirect non-admin users to regular home page
      router.push("/")
      return
    }

    setIsAuthenticated(true)
    setIsAdmin(true)
    setIsLoading(false)

  }, [router, searchParams])

  // Load draft lessons
  useEffect(() => {
    const loadDraftLessons = async () => {
      if (!isAuthenticated || !isAdmin) return

      setIsDraftLoading(true)
      setDraftError(null)

      try {
        const drafts = await getDraftLessons()
        setDraftLessons(drafts)
      } catch (error) {
        console.error('Failed to load draft lessons:', error)
        setDraftError(error instanceof Error ? error.message : 'Failed to load draft lessons')
      } finally {
        setIsDraftLoading(false)
      }
    }

    loadDraftLessons()
  }, [isAuthenticated, isAdmin])

  const handleEditDraft = (lessonId: number) => {
    router.push(`/backoffice/create-lesson?edit=${lessonId}`)
  }

  const handleDeleteDraft = (lessonId: number, lessonTitle: string) => {
    setDeleteModal({
      isOpen: true,
      lessonId,
      lessonTitle
    })
  }

  const confirmDelete = async () => {
    if (!deleteModal.lessonId) return

    try {
      // Show loading toast
      const loadingToast = toast.loading('Deleting lesson...')

      await deleteLesson(deleteModal.lessonId)
      
      // Remove from local state immediately for better UX
      setDraftLessons(prev => prev.filter(lesson => lesson.id !== deleteModal.lessonId))
      
      // Close modal
      setDeleteModal({ isOpen: false, lessonId: null, lessonTitle: "" })
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success('Draft lesson deleted successfully')
      
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete lesson')
    }
  }

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, lessonId: null, lessonTitle: "" })
  }

  const filteredDrafts = draftLessons.filter(lesson =>
    lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedNavbar currentPage="backoffice" />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage lessons, view analytics, and oversee platform content</p>
          </div>
          <div className="flex gap-3">
            <Link href="/backoffice/create-lesson">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Lesson
              </Button>
            </Link>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color}`}>{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="drafts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="drafts">Draft Lessons</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Draft Lessons Tab */}
          <TabsContent value="drafts" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-amber-600" />
                      Draft Lessons ({filteredDrafts.length})
                    </CardTitle>
                    <CardDescription>Continue working on unpublished lessons</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search drafts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDraftLoading ? (
                  <div className="text-center py-12">
                    <Sparkles className="h-8 w-8 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading draft lessons...</p>
                  </div>
                ) : draftError ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.858-.833-2.828 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Failed to load draft lessons</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{draftError}</p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : filteredDrafts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No draft lessons found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchQuery ? "Try adjusting your search criteria." : "Start by creating a new lesson."}
                    </p>
                    <Link href="/backoffice/create-lesson">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Lesson
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredDrafts.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                        <Edit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{lesson.grade}</Badge>
                          <Badge variant="outline" className="text-xs">{lesson.subject}</Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            By {lesson.author?.firstName} {lesson.author?.lastName} • {formatRelativeTime(lesson.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDraft(lesson.id)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDraft(lesson.id, lesson.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions performed by admin users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        {activity.type === "publish" && "published"}
                        {activity.type === "create" && "created"}
                        {activity.type === "edit" && "edited"}
                        {activity.type === "delete" && "deleted"}
                        {" "}
                        <span className="font-medium">"{activity.lesson}"</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">New Lessons This Month</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">45.2K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">3,156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">4.7 ⭐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    Popular Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { subject: "English Language Arts", count: "445 lessons", width: "90%" },
                      { subject: "Writing", count: "287 lessons", width: "65%" },
                      { subject: "ESL", count: "234 lessons", width: "55%" },
                      { subject: "Literature", count: "156 lessons", width: "35%" },
                      { subject: "Grammar", count: "125 lessons", width: "28%" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.subject}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                            style={{ width: item.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.isOpen} onOpenChange={cancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              Delete Draft Lesson
            </DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to delete <span className="font-medium">"{deleteModal.lessonTitle}"</span>? 
              This action cannot be undone and all progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}