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
import { useSearchParams } from "next/navigation"
import { createLesson, createLessonWithFiles, updateLessonWithFiles, getLessonById, CreateLessonData } from "@/services/lessons/create-lesson"
import type { LessonProcedure } from "@/services/lessons/get-lessons"
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { toast } from "@/lib/toast"

// Draft schema - very minimal validation, allow saving incomplete lessons
const draftSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  grade: z.string().optional(),
  subject: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "HARD"]).optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  procedures: z.array(z.object({
    title: z.string(),
    duration: z.string(),
    description: z.string()
  })).optional(),
  assessment: z.array(z.string()).optional(),
  lessonActivities: z.array(z.object({
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
  grade: z.string().min(1, "Grade is required"),
  subject: z.string().min(1, "Subject is required"),
  duration: z.string().min(1, "Duration is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "HARD"]).optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  procedures: z.array(z.object({
    title: z.string(),
    duration: z.string(),
    description: z.string()
  })).optional(),
  assessment: z.array(z.string()).optional(),
  lessonActivities: z.array(z.object({
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

const subjects = [
  "English Language Arts",
  "Mathematics",
  "Science",
  "Social Studies",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Language",
  "Computer Science",
  "ESL",
  "Special Education",
  "Other"
]

const grades = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade", 
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "Adult Education"
]

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
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  // Core state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitType, setSubmitType] = useState<'draft' | 'publish'>('draft')
  const [isLoadingLesson, setIsLoadingLesson] = useState(false)
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(editId ? parseInt(editId) : null)
  
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
      setValue('grade', lesson.grade)
      setValue('subject', lesson.subject)
      setValue('duration', lesson.duration)
      setValue('difficulty', lesson.difficulty as "Beginner" | "Intermediate" | "HARD")
      setValue('tags', lesson.tags || [])
      setValue('objectives', lesson.objectives || [])
      setValue('materials', lesson.materials || [])
      setValue('procedures', lesson.procedures || [])
      setValue('assessment', lesson.assessment || [])
      setValue('lessonActivities', lesson.lessonActivities || [])
      setValue('isPremium', lesson.isPremium)
      
      // Handle existing files
      setExistingFiles(lesson.downloadFiles || [])
      
      if (lesson.previewImage) {
        setPreviewImageUrl(lesson.previewImage)
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
      lessonActivities: [],
      downloadFiles: [],
      isPremium: false,
    },
  })

  const watchedTags = watch("tags") || []
  const watchedObjectives = watch("objectives") || []
  const watchedMaterials = watch("materials") || []
  const watchedProcedures = watch("procedures") || []
  const watchedAssessment = watch("assessment") || []
  const watchedLessonActivities = watch("lessonActivities") || []
  const watchedDownloadFiles = watch("downloadFiles") || []

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
      setValue("lessonActivities", [...watchedLessonActivities, {
        skill: newActivitySkill.trim(),
        description: newActivityDescription.trim()
      }])
      setNewActivitySkill("")
      setNewActivityDescription("")
    }
  }

  const removeLessonActivity = (index: number) => {
    setValue("lessonActivities", watchedLessonActivities.filter((_, i) => i !== index))
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
    setExistingFiles(prev => prev.filter(f => f.url !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "HARD":
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
        grade: data.grade || '',
        subject: data.subject || '',
        duration: data.duration || '',
        difficulty: data.difficulty,
        tags: data.tags?.filter(tag => tag?.trim()) || [],
        objectives: data.objectives?.filter(obj => obj?.trim()) || [],
        materials: data.materials?.filter(mat => mat?.trim()) || [],
        procedures: data.procedures?.filter(proc => 
          proc?.title?.trim() && proc?.duration?.trim() && proc?.description?.trim()) || [],
        assessment: data.assessment?.filter(ass => ass?.trim()) || [],
        lessonActivities: data.lessonActivities?.filter(activity => 
          activity?.skill?.trim() && activity?.description?.trim()) || [],
        isPremium: data.isPremium || false,
        action: type === 'publish' ? 'publish' : 'save',
      }

      let result
      const isUpdate = !!currentLessonId

      if (isUpdate) {
        // Update existing lesson
        result = await updateLessonWithFiles(
          currentLessonId!,
          lessonData,
          coverImageChanged ? previewImageFile : undefined,
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

      // Reset file tracking state
      setDownloadFiles([])
      setRemovedFileIds([])
      setCoverImageChanged(false)
      setPreviewImageFile(null)

      // Navigate back to backoffice with success message
      const message = type === 'publish' ? 'published=true' : 'created=true'
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
    await onSubmit(formData, 'draft')
  }
  
  // For publish, use form validation
  const handlePublish = handleSubmit((data) => onSubmit(data, 'publish'))

  // Loading state
  if (isLoadingLesson) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AuthenticatedNavbar currentPage="lessons" />
        <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading lesson data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Button disabled state
  const buttonsDisabled = isSubmitting || isLoadingLesson
  const canSave = watch("title") && watch("description") && watch("grade") && watch("subject") && watch("duration")

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
                  {currentLessonId ? 'Edit Lesson' : 'Create New Lesson'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLessonId ? 'Update your lesson content' : 'Build engaging content for your students'}
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

              {/* Grade, Subject, Duration, Difficulty Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Level *</Label>
                  <Select onValueChange={(value) => setValue("grade", value)}>
                    <SelectTrigger className={`w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.grade ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-red-500">{errors.grade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select onValueChange={(value) => setValue("subject", value)}>
                    <SelectTrigger className={`w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.subject ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select onValueChange={(value) => setValue("duration", value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select onValueChange={(value) => setValue("difficulty", value as "Beginner" | "Intermediate" | "HARD")}>
                    <SelectTrigger className="w-full min-w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
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
                {watchedLessonActivities.map((activity, index) => (
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
                  <div key={`existing-${index}`} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{file.name}</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">{file.type} • {file.size}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Existing file</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingFile(file.url)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* New Files */}
                {downloadFiles.map((file, index) => (
                  <div key={`new-${index}`} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">{file.name}</p>
                        <p className="text-xs text-green-700 dark:text-green-300">{file.type} • {formatFileSize(file.size)}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">New file</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDownloadFile(index)}
                        className="text-red-500 hover:text-red-700"
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
                  {watch("difficulty") && (
                    <Badge className={getDifficultyColor(watch("difficulty"))}>
                      {watch("difficulty") === "Beginner" ? "Beginner" : 
                       watch("difficulty") === "Intermediate" ? "Intermediate" : 
                       watch("difficulty") === "HARD" ? "Advanced" : 
                       watch("difficulty")}
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
                  {watch("grade") && <Badge variant="outline">{watch("grade")}</Badge>}
                  {watch("subject") && <Badge variant="outline">{watch("subject")}</Badge>}
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
                  {watch("grade") && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Grade {watch("grade")}</span>
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

                  {watchedObjectives.length > 0 && watchedLessonActivities.length > 0 && <Separator />}

                  {/* Lesson Activities */}
                  {watchedLessonActivities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        Skills & Activities
                      </h3>
                      <div className="space-y-3">
                        {watchedLessonActivities.map((activity, index) => (
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