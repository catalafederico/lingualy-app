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
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar"
import { toast } from "@/lib/toast"

// This will be the client-side only content
export default function CreateLessonContent() {
  const router = useRouter()
  
  // URL parameter handling (client-side only)
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null)
  
  useEffect(() => {
    // Handle URL parameters client-side
    const urlParams = new URLSearchParams(window.location.search)
    const editId = urlParams.get('edit')
    if (editId) {
      setCurrentLessonId(parseInt(editId))
    }
  }, [])
  
  // For now, return a placeholder
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedNavbar currentPage="lessons" />
      <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentLessonId ? 'Edit Lesson' : 'Create New Lesson'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentLessonId ? 'Update your lesson content' : 'Build engaging content for your students'}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Current lesson ID: {currentLessonId || 'None'}
          </p>
        </div>
      </main>
    </div>
  )
}