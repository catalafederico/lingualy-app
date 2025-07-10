"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdmin as checkIsAdmin, isAuthenticated as checkIsAuthenticated } from "@/lib/auth"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Eye,
  Upload,
  BookOpen,
  Clock,
  Target,
  Users,
  Award,
  FileText,
  Sparkles,
  PlayCircle,
  CheckCircle,
  Star,
  Download,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { createLesson, createLessonWithFiles, updateLessonWithFiles, getLessonById, CreateLessonData } from "@/services/lessons/create-lesson"
import type { LessonProcedure } from "@/services/lessons/get-lessons"
import { CEFR_LEVELS, LESSON_CATEGORIES } from "@/lib/constants"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { toast } from "@/lib/toast"

// Draft schema - very minimal validation, allow saving incomplete lessons
const draftSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  procedures: z.array(z.object({
    title: z.string(),
    duration: z.string(),
    description: z.string()
  })).optional(),
  assessment: z.array(z.string()).optional(),
  activities: z.array(z.object({
    skill: z.string(),
    description: z.string()
  })).optional(),
  previewImage: z.string().optional(),
  downloadFiles: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.string(),
    url: z.string().optional()
  })).optional(),
  isPremium: z.boolean().optional(),
})

// Publish schema - strict validation, all required fields must be present
const publishSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fullDescription: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  procedures: z.array(z.object({
    title: z.string(),
    duration: z.string(),
    description: z.string()
  })).optional(),
  assessment: z.array(z.string()).optional(),
  activities: z.array(z.object({
    skill: z.string(),
    description: z.string()
  })).optional(),
  previewImage: z.string().optional(),
  downloadFiles: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.string(),
    url: z.string().optional()
  })).optional(),
  isPremium: z.boolean().optional(),
})

// Default to draft schema for form validation
const lessonSchema = draftSchema

type LessonFormData = z.infer<typeof lessonSchema>

// Extract values from constants for use in selects
const levels = CEFR_LEVELS.map(level => level.value)
const categories = LESSON_CATEGORIES.map(category => category.value)

const durations = [
  "15 minutes",
  "30 minutes", 
  "45 minutes",
  "60 minutes",
  "90 minutes",
  "2 hours",
  "Multiple days",
  "1 week",
  "Custom"
]

export default function CreateLessonPage() {
  const router = useRouter()
  // Core state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitType, setSubmitType] = useState<'draft' | 'publish'>('draft')
  const [isLoadingLesson, setIsLoadingLesson] = useState(false)
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  // Form input state
  const [newTag, setNewTag] = useState("")
  const [newObjective, setNewObjective] = useState("")
  const [newMaterial, setNewMaterial] = useState("")
  const [newProcedureTitle, setNewProcedureTitle] = useState("")
  const [newProcedureDuration, setNewProcedureDuration] = useState("")
  const [newProcedureDescription, setNewProcedureDescription] = useState("")
  const [newAssessment, setNewAssessment] = useState("")
  const [newActivitySkill, setNewActivitySkill] = useState("")
  const [newActivityDescription, setNewActivityDescription] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  
  // File handling state
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("")
  const [downloadFiles, setDownloadFiles] = useState<File[]>([])
  const [existingFiles, setExistingFiles] = useState<any[]>([])
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([])
  const [coverImageChanged, setCoverImageChanged] = useState(false)
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)

  // Client-side hydration and URL parameter handling
  useEffect(() => {
    setIsClient(true)
    
    // Handle URL parameters client-side to avoid hydration issues
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const editId = urlParams.get('edit')
      if (editId) {
        setCurrentLessonId(parseInt(editId))
      }
    }
  }, [])

  // Admin access check
  useEffect(() => {
    if (!checkIsAuthenticated()) {
      router.push("/login")
      return
    }
    
    if (!checkIsAdmin()) {
      router.push("/home")
      return
    }
  }, [router])

  // Compute page title and description to avoid hydration mismatch
  // Always show 'Create New Lesson' initially to avoid hydration mismatch
  const pageTitle = 'Create New Lesson'
  const pageDescription = 'Build engaging content for your students'
  
  // Dynamic title and description that updates after hydration
  const [dynamicTitle, setDynamicTitle] = useState(pageTitle)
  const [dynamicDescription, setDynamicDescription] = useState(pageDescription)
  
  // Update dynamic title once we know if we're in edit mode
  useEffect(() => {
    if (isClient) {
      if (currentLessonId) {
        setDynamicTitle('Edit Lesson')
        setDynamicDescription('Update your lesson content')
      } else {
        setDynamicTitle('Create New Lesson')
        setDynamicDescription('Build engaging content for your students')
      }
    }
  }, [isClient, currentLessonId])

  // Load existing lesson data when editing
  useEffect(() => {
    if (currentLessonId && !isLoadingLesson) {
      loadExistingLesson()
    }
  }, [currentLessonId])

  const loadExistingLesson = async () => {
    if (!currentLessonId) return
    
    try {
      setIsLoadingLesson(true)
      const lesson = await getLessonById(currentLessonId)
      
      
      // Populate form with existing data
      setValue('title', lesson.title)
      setValue('description', lesson.description)
      setValue('fullDescription', lesson.fullDescription || '')
      setValue('level', lesson.level)
      setValue('category', lesson.category)
      setValue('duration', lesson.duration)
      setValue('tags', lesson.tags || [])
      setValue('objectives', lesson.objectives || [])
      setValue('materials', lesson.materials || [])
      setValue('procedures', lesson.procedures || [])
      setValue('assessment', lesson.assessment || [])
      setValue('activities', lesson.activities || [])
      setValue('isPremium', lesson.isPremium)
      
      // Handle existing files - map backend format to frontend display format
      const mappedFiles = (lesson.downloadFiles || []).map(mapDownloadFileForDisplay)
      setExistingFiles(mappedFiles)
      
      // Load cover image from public URL if available
      if (lesson.coverImage?.publicUrl) {
        setPreviewImageUrl(lesson.coverImage.publicUrl)
      }
      
    } catch (error) {
      console.error('Error loading lesson:', error)
      toast.error('Error loading lesson', 'Failed to load lesson data. Please try again.')
    } finally {
      setIsLoadingLesson(false)
    }
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      tags: [],
      objectives: [],
      materials: [],
      procedures: [],
      assessment: [],
      activities: [],
      downloadFiles: [],
      isPremium: false,
    },
  })

  const watchedTags = Array.isArray(watch("tags")) ? watch("tags")! : []
  const watchedObjectives = Array.isArray(watch("objectives")) ? watch("objectives")! : []
  const watchedMaterials = Array.isArray(watch("materials")) ? watch("materials")! : []
  const watchedProcedures = Array.isArray(watch("procedures")) ? watch("procedures")! : []
  const watchedAssessment = Array.isArray(watch("assessment")) ? watch("assessment")! : []
  const watchedActivities = Array.isArray(watch("activities")) ? watch("activities")! : []
  const watchedDownloadFiles = Array.isArray(watch("downloadFiles")) ? watch("downloadFiles")! : []

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue("tags", [...watchedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setValue("tags", watchedTags.filter((_, i) => i !== index))
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setValue("objectives", [...watchedObjectives, newObjective.trim()])
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setValue("objectives", watchedObjectives.filter((_, i) => i !== index))
  }

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setValue("materials", [...watchedMaterials, newMaterial.trim()])
      setNewMaterial("")
    }
  }

  const removeMaterial = (index: number) => {
    setValue("materials", watchedMaterials.filter((_, i) => i !== index))
  }

  const addProcedure = () => {
    if (newProcedureTitle.trim() && newProcedureDuration.trim() && newProcedureDescription.trim()) {
      setValue("procedures", [...watchedProcedures, {
        title: newProcedureTitle.trim(),
        duration: newProcedureDuration.trim(),
        description: newProcedureDescription.trim()
      }])
      setNewProcedureTitle("")
      setNewProcedureDuration("")
      setNewProcedureDescription("")
    }
  }

  const removeProcedure = (index: number) => {
    setValue("procedures", watchedProcedures.filter((_, i) => i !== index))
  }

  const addAssessment = () => {
    if (newAssessment.trim()) {
      setValue("assessment", [...watchedAssessment, newAssessment.trim()])
      setNewAssessment("")
    }
  }

  const removeAssessment = (index: number) => {
    setValue("assessment", watchedAssessment.filter((_, i) => i !== index))
  }

  const addLessonActivity = () => {
    if (newActivitySkill.trim() && newActivityDescription.trim()) {
      setValue("activities", [...watchedActivities, {
        skill: newActivitySkill.trim(),
        description: newActivityDescription.trim()
      }])
      setNewActivitySkill("")
      setNewActivityDescription("")
    }
  }

  const removeLessonActivity = (index: number) => {
    setValue("activities", watchedActivities.filter((_, i) => i !== index))
  }

  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPreviewImageFile(file)
      setCoverImageChanged(true)
      const imageUrl = URL.createObjectURL(file)
      setPreviewImageUrl(imageUrl)
      // Don't set form value - we'll send file directly
    }
  }

  const removePreviewImage = () => {
    setPreviewImageFile(null)
    setCoverImageChanged(true)
    setPreviewImageUrl("")
    // Don't set form value - we'll handle this in submission
  }

  const handleDownloadFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setDownloadFiles(prev => [...prev, ...files])
    // Don't set form value - we'll send files directly
  }

  const removeDownloadFile = (index: number) => {
    setDownloadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingFile = (fileId: string) => {
    setRemovedFileIds(prev => [...prev, fileId])
    setExistingFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Helper function to map backend download file to frontend display format
  const mapDownloadFileForDisplay = (file: any) => ({
    id: file.id || file.publicUrl || file.url, // Use id, fallback to URL for identification
    name: file.originalName || file.name,
    type: file.mimeType || file.type,
    size: file.sizeInBytes ? formatFileSize(file.sizeInBytes) : file.size,
    url: file.publicUrl || file.url,
    displayName: file.displayName || file.originalName || file.name,
    extension: file.extension,
    uploadedAt: file.uploadedAt,
    downloadCount: file.downloadCount || 0
  })

  // Download file function with fallback logic
  const handleFileDownload = async (file: any) => {
    if (downloadingFileId === file.id) return // Prevent double downloads

    try {
      setDownloadingFileId(file.id)

      if (file.url && file.url !== '' && file.url !== '#') {
        // Open file in new tab via public URL
        window.open(file.url, '_blank')
      } else if (currentLessonId) {
        // Secure download via API endpoint
        const response = await axios.get(`/lessons/${currentLessonId}/files/${file.id}`)
        const { downloadUrl } = response.data

        // Open file in new tab
        window.open(downloadUrl, '_blank')
      } else {
        toast.error('Failed to open file', 'Unable to open file at this time')
      }
    } catch (error: any) {
      console.error('File open error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to open file'
      toast.error('Failed to open file', errorMessage)
    } finally {
      setDownloadingFileId(null)
    }
  }

  // Open new (local) file function
  const handleNewFileDownload = (file: File) => {
    try {
      const url = URL.createObjectURL(file)
      // Open in new tab instead of forcing download
      window.open(url, '_blank')
      
      // Clean up URL after a delay to allow the browser to load it
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
    } catch (error: any) {
      console.error('File open error:', error)
      toast.error('Failed to open file', 'Unable to open the file')
    }
  }

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

  const handlePreview = () => {
    setShowPreview(true)
  }

  // Toast helper functions
  const showSuccessToast = (type: 'draft' | 'publish', isUpdate: boolean) => {
    if (type === 'draft') {
      toast.success(isUpdate ? 'Draft updated successfully!' : 'Draft saved successfully!', 
        'Your lesson has been saved and can be edited later.')
    } else {
      toast.success(isUpdate ? 'Lesson updated and published!' : 'Lesson published successfully!', 
        'Your lesson is now available to students.')
    }
  }

  const showErrorToast = (error: any, type: 'draft' | 'publish') => {
    const action = type === 'draft' ? 'saving draft' : 'publishing lesson'
    toast.error(`Error ${action}`, error.message || 'Please check your input and try again.')
  }

  const onSubmit = async (data: LessonFormData, type: 'draft' | 'publish' = 'draft') => {
    try {
      setIsSubmitting(true)
      setSubmitType(type)


      // Validate against appropriate schema based on submission type
      if (type === 'publish') {
        try {
          publishSchema.parse(data)
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            // Show first validation error
            const firstError = validationError.errors[0]
            toast.error("Validation Error", `${firstError.path.join('.')}: ${firstError.message}`)
            return
          }
        }
      }

      // Prepare lesson data (exclude file fields)
      const lessonData = {
        title: data.title || '',
        description: data.description || '',
        fullDescription: data.fullDescription || '',
        level: data.level || '',
        category: data.category || '',
        duration: data.duration || '',
        tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag && tag.trim()) : [],
        objectives: Array.isArray(data.objectives) ? data.objectives.filter(obj => obj && obj.trim()) : [],
        materials: Array.isArray(data.materials) ? data.materials.filter(mat => mat && mat.trim()) : [],
        procedures: Array.isArray(data.procedures) ? data.procedures.filter(proc => 
          proc && proc.title && proc.title.trim() && proc.duration && proc.duration.trim() && proc.description && proc.description.trim()) : [],
        assessment: Array.isArray(data.assessment) ? data.assessment.filter(ass => ass && ass.trim()) : [],
        activities: Array.isArray(data.activities) ? data.activities.filter(activity => 
          activity && activity.skill && activity.skill.trim() && activity.description && activity.description.trim()) : [],
        isPremium: data.isPremium || false,
        action: type === 'publish' ? 'publish' as const : 'save' as const,
      }

      let result
      const isUpdate = !!currentLessonId

      if (isUpdate) {
        // Update existing lesson
        result = await updateLessonWithFiles(
          currentLessonId!,
          lessonData,
          coverImageChanged ? (previewImageFile || undefined) : undefined,
          downloadFiles,
          removedFileIds
        )
      } else {
        // Create new lesson
        result = await createLessonWithFiles(
          lessonData,
          previewImageFile || undefined,
          downloadFiles
        )
        
        // Update URL and state with new lesson ID
        setCurrentLessonId(result.id)
        window.history.replaceState(null, '', `/backoffice/create-lesson?edit=${result.id}`)
      }

      // Show success toast
      showSuccessToast(type, isUpdate)

      // Update existing files with the server response to show newly uploaded files
      if (result.downloadFiles) {
        const updatedExistingFiles = result.downloadFiles.map(mapDownloadFileForDisplay)
        setExistingFiles(updatedExistingFiles)
      }

      // Reset file tracking state  
      setDownloadFiles([]) // Clear new files that were just uploaded
      setRemovedFileIds([]) // Clear removed file tracking
      setCoverImageChanged(false) // Reset cover image change flag
      setPreviewImageFile(null) // Clear cover image file

      // Navigate back to backoffice with success message
      let message: string
      if (type === 'publish') {
        message = 'published=true'
      } else if (isUpdate) {
        message = 'saved=true'
      } else {
        message = 'created=true'
      }
      router.push(`/backoffice?${message}`)

    } catch (error) {
      console.error("Error saving lesson:", error)
      showErrorToast(error, type)
    } finally {
      setIsSubmitting(false)
    }
  }

  // For draft, bypass form validation and get raw form data
  const handleSaveDraft = async () => {
    const formData = getValues()
    
    // Ensure all array fields are properly initialized to prevent filter errors
    const safeFormData = {
      ...formData,
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      objectives: Array.isArray(formData.objectives) ? formData.objectives : [],
      materials: Array.isArray(formData.materials) ? formData.materials : [],
      procedures: Array.isArray(formData.procedures) ? formData.procedures : [],
      assessment: Array.isArray(formData.assessment) ? formData.assessment : [],
      activities: Array.isArray(formData.activities) ? formData.activities : [],
      downloadFiles: Array.isArray(formData.downloadFiles) ? formData.downloadFiles : [],
    }
    
    await onSubmit(safeFormData, 'draft')
  }
  
  // For publish, use form validation
  const handlePublish = handleSubmit((data) => onSubmit(data, 'publish'))

  // Loading state - only show loading when actually loading lesson data
  if (isLoadingLesson) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AuthenticatedNavbar currentPage="lessons" />
        <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading lesson data...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Button disabled state
  const buttonsDisabled = isSubmitting || isLoadingLesson
  const canSave = watch("title") && watch("description") && watch("level") && watch("category") && watch("duration")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedNavbar currentPage="lessons" />

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          {/* Centered Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dynamicTitle}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dynamicDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation and Action Buttons */}
          <div className="flex items-center justify-between">
            <Link href="/backoffice">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button 
                onClick={handlePreview}
                variant="outline" 
                size="sm" 
                disabled={buttonsDisabled}
                className="gap-1 sm:gap-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button 
                onClick={handleSaveDraft}
                disabled={buttonsDisabled}
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">{isSubmitting && submitType === 'draft' ? "Saving..." : "Save as Draft"}</span>
                <span className="sm:hidden">Draft</span>
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={buttonsDisabled || !canSave}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-1 sm:gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">{isSubmitting && submitType === 'publish' ? "Publishing..." : "Publish"}</span>
                <span className="sm:hidden">Publish</span>
              </Button>
            </div>
          </div>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Start with the essential details about your lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lesson Image */}
              <div className="space-y-2">
                <Label>Lesson Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="preview-image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 aspect-video max-h-64">
                    {previewImageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImageUrl}
                          alt="Lesson Image"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={watch("isPremium") ? "bg-amber-500 text-white" : "bg-blue-500 text-white"}>
                            {watch("isPremium") ? "Premium" : "Free"}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={removePreviewImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          PNG, JPG or JPEG (MAX. 10MB)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended: 1280x720px (16:9 ratio) for best display
                        </p>
                      </div>
                    )}
                    <input
                      id="preview-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePreviewImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Title and Premium Toggle */}
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2">
                    <Input
                      id="title"
                      placeholder="Enter a compelling lesson title"
                      {...register("title")}
                      className={`bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.title ? "border-red-500" : ""}`}
                    />
                  </div>
                  <div className="flex flex-col lg:items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="premium-toggle" className="text-sm font-medium">
                          Premium
                        </Label>
                        <Switch
                          id="premium-toggle"
                          checked={watch("isPremium") || false}
                          onCheckedChange={(checked) => setValue("isPremium", checked)}
                          className="data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600 data-[state=checked]:bg-amber-500 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      <Badge variant={watch("isPremium") ? "default" : "secondary"} className={watch("isPremium") ? "bg-amber-500 text-white" : "bg-blue-500 text-white"}>
                        {watch("isPremium") ? "Premium" : "Free"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 lg:text-left">
                      Premium lessons require a subscription to access
                    </p>
                  </div>
                </div>
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Brief Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Brief Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Write a brief overview that will appear in lesson listings"
                  rows={3}
                  {...register("description")}
                  className={`bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <Label htmlFor="fullDescription">Detailed Description</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Provide a comprehensive description of your lesson (optional)"
                  rows={4}
                  {...register("fullDescription")}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              {/* Level, Category, Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="level">CEFR Level *</Label>
                  <Select onValueChange={(value) => setValue("level", value)} value={watch("level") || ""}>
                    <SelectTrigger className={`w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.level ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select CEFR level" />
                    </SelectTrigger>
                    <SelectContent>
                      {CEFR_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)} value={watch("category") || ""}>
                    <SelectTrigger className={`w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.category ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {LESSON_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select onValueChange={(value) => setValue("duration", value)} value={watch("duration") || ""}>
                    <SelectTrigger className={`w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.duration ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-sm text-red-500">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm" className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                Learning Objectives
              </CardTitle>
              <CardDescription>
                Define what students will learn and achieve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a learning objective"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective} variant="outline" size="sm" className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {watchedObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Materials & Resources */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Materials & Resources
              </CardTitle>
              <CardDescription>
                List what materials students and teachers will need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a material or resource"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
                />
                <Button type="button" onClick={addMaterial} variant="outline" size="sm" className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {watchedMaterials.map((material, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{material}</span>
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Procedures */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-amber-600" />
                Lesson Procedures
              </CardTitle>
              <CardDescription>
                Step-by-step instructions for conducting the lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Step title"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newProcedureTitle}
                  onChange={(e) => setNewProcedureTitle(e.target.value)}
                />
                <Input
                  placeholder="Duration (e.g., 10 minutes)"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newProcedureDuration}
                  onChange={(e) => setNewProcedureDuration(e.target.value)}
                />
                <Input
                  placeholder="Step description"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newProcedureDescription}
                  onChange={(e) => setNewProcedureDescription(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProcedure())}
                />
              </div>
              <Button type="button" onClick={addProcedure} variant="outline" size="sm" className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Procedure Step
              </Button>
              <div className="space-y-2">
                {watchedProcedures.map((procedure, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{procedure.title}</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400">{procedure.duration}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProcedure(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-11">{procedure.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Assessment & Evaluation
              </CardTitle>
              <CardDescription>
                How will you measure student understanding?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add an assessment method"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newAssessment}
                  onChange={(e) => setNewAssessment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAssessment())}
                />
                <Button type="button" onClick={addAssessment} variant="outline" size="sm" className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {watchedAssessment.map((assessment, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{assessment}</span>
                    <button
                      type="button"
                      onClick={() => removeAssessment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lesson Activities */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Skills & Activities
              </CardTitle>
              <CardDescription>
                Describe the specific skills students will practice (e.g., Speaking, Reading, Writing, Vocabulary)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  placeholder="Skill (e.g., Speaking, Reading, Writing)"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newActivitySkill}
                  onChange={(e) => setNewActivitySkill(e.target.value)}
                />
                <Input
                  placeholder="Activity description"
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLessonActivity())}
                />
              </div>
              <Button type="button" onClick={addLessonActivity} variant="outline" size="sm" className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill Activity
              </Button>
              <div className="space-y-2">
                {watchedActivities.map((activity, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {activity.skill.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{activity.skill}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLessonActivity(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-8">{activity.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Download Files */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Download Files
              </CardTitle>
              <CardDescription>
                Add files that students and teachers can download with this lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="download-files-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload files</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (MAX. 50MB per file)
                    </p>
                  </div>
                  <input
                    id="download-files-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleDownloadFileChange}
                  />
                </label>
              </div>
              
              {/* Files List */}
              <div className="space-y-3">
                {/* Existing Files */}
                {existingFiles.map((file, index) => (
                  <div 
                    key={`existing-${index}`} 
                    className="relative p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                    onClick={() => handleFileDownload(file)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{file.name}</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">{file.type} • {file.size}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {downloadingFileId === file.id ? 'Opening...' : 'Existing file - Click to open'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeExistingFile(file.id)
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {downloadingFileId === file.id && (
                      <div className="absolute inset-0 bg-blue-50/80 dark:bg-blue-900/80 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* New Files */}
                {downloadFiles.map((file, index) => (
                  <div 
                    key={`new-${index}`} 
                    className="relative p-4 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                    onClick={() => handleNewFileDownload(file)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">{file.name}</p>
                        <p className="text-xs text-green-700 dark:text-green-300">{file.type} • {formatFileSize(file.size)}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">New file - Click to open</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeDownloadFile(index)
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </form>
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600" />
              Lesson Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {/* Preview Content - Similar to lesson details page */}
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-lg">
                {previewImageUrl || watch("previewImage") ? (
                  <img
                    src={previewImageUrl || watch("previewImage") || "/placeholder.svg"}
                    alt={watch("title") || "Lesson Image"}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Upload className="h-12 w-12 mx-auto mb-2" />
                      <p>No image uploaded</p>
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 right-4">
                  {watch("level") && (
                    <Badge className={getLevelColor(watch("level") || "")}>
                      {watch("level")}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-green-500 text-white">New</Badge>
                  <Badge className={watch("isPremium") ? "bg-amber-500 text-white" : "bg-blue-500 text-white"}>
                    {watch("isPremium") ? "Premium" : "Free"}
                  </Badge>
                </div>
              </div>

              {/* Title and Description */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {watch("level") && <Badge variant="outline">{watch("level")}</Badge>}
                  {watch("category") && <Badge variant="outline">{watch("category")}</Badge>}
                  {watchedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {watch("title") || "Untitled Lesson"}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {watch("fullDescription") || watch("description") || "No description provided"}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-6 pt-4 text-sm text-gray-600 dark:text-gray-400">
                  {watch("duration") && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{watch("duration")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>New</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>0 downloads</span>
                  </div>
                  {watch("level") && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{watch("level")} Level</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Learning Objectives */}
                  {watchedObjectives.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-amber-600" />
                        Learning Objectives
                      </h3>
                      <ul className="space-y-2">
                        {watchedObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {watchedObjectives.length > 0 && watchedActivities.length > 0 && <Separator />}

                  {/* Lesson Activities */}
                  {watchedActivities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        Skills & Activities
                      </h3>
                      <div className="space-y-3">
                        {watchedActivities.map((activity, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                {activity.skill.charAt(0)}
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{activity.skill}</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm ml-8">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="procedures" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-amber-600" />
                    Lesson Procedures
                  </h3>
                  {watchedProcedures.length > 0 ? (
                    watchedProcedures.map((step, index) => (
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
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No procedures added yet.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="materials" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    Required Materials
                  </h3>
                  {watchedMaterials.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {watchedMaterials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{material}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No materials added yet.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="assessment" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    Assessment Criteria
                  </h3>
                  {watchedAssessment.length > 0 ? (
                    <ul className="space-y-3">
                      {watchedAssessment.map((criteria, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No assessment criteria added yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}