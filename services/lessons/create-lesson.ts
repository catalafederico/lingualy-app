import axios from "@/lib/axios"
import { Lesson, LessonProcedure, LessonDownloadFile, LessonActivity } from "./get-lessons"
import { mockLessons } from "./mock-data"

export interface CreateLessonData {
  title: string
  description: string
  fullDescription?: string
  grade: string
  subject: string
  duration: string
  difficulty?: string
  previewImage?: string
  tags?: string[]
  isNew?: boolean
  isPremium?: boolean
  objectives?: string[]
  materials?: string[]
  procedures?: LessonProcedure[]
  assessment?: string[]
  lessonActivities?: LessonActivity[]
  previewImage?: string
  downloadFiles?: LessonDownloadFile[]
}

export const createLesson = async (data: CreateLessonData): Promise<Lesson> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.post('/lessons', data)
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Create a new lesson with mock data
  const newLesson: Lesson = {
    id: Math.max(...mockLessons.map(l => l.id)) + 1,
    title: data.title,
    description: data.description,
    fullDescription: data.fullDescription || "",
    grade: data.grade,
    subject: data.subject,
    duration: data.duration,
    difficulty: data.difficulty || "MEDIUM",
    rating: 0,
    downloads: 0,
    previewImage: data.previewImage || "/placeholder.svg?height=200&width=300",
    tags: data.tags || [],
    isNew: data.isNew || true,
    isPremium: data.isPremium || false,
    objectives: data.objectives || [],
    materials: data.materials || [],
    procedures: data.procedures || [],
    assessment: data.assessment || [],
    lessonActivities: data.lessonActivities || [],
    downloadFiles: data.downloadFiles || [],
    viewCount: 0,
    favoriteCount: 0,
    author: {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson", 
      email: "sarah.johnson@example.com"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Add to mock lessons array (in real app this would be handled by the backend)
  mockLessons.unshift(newLesson)
  
  return newLesson
}

export const updateLesson = async (id: number, data: Partial<CreateLessonData>): Promise<Lesson> => {
  const response = await axios.patch(`/lessons/${id}`, data)
  return response.data
}

export const deleteLesson = async (id: number): Promise<void> => {
  await axios.delete(`/lessons/${id}`)
}

export const downloadLesson = async (id: number): Promise<Lesson> => {
  const response = await axios.post(`/lessons/${id}/download`)
  return response.data
}

export const rateLesson = async (id: number, rating: number): Promise<void> => {
  await axios.post(`/lessons/${id}/rate`, { rating })
}