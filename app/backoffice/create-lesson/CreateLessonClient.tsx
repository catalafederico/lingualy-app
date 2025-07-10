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

// Import the existing component content
export default function CreateLessonClient() {
  // This will be a client-side only component
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Import the CreateLessonPage component content here
  return <div>Client-side component placeholder</div>
}