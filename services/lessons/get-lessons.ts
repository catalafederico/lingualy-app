import axios from "@/lib/axios"
import { mockLessonsResponse, mockFeaturedLessons, mockLessons } from "./mock-data"

export interface LessonQueryParams {
  page?: number
  limit?: number
  search?: string
  categories?: string[]
  levels?: string[]
  types?: string[]
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface LessonProcedure {
  title: string
  duration: string
  description: string
}

export interface LessonDownloadFile {
  id: string
  originalName: string
  displayName: string
  mimeType: string
  sizeInBytes: number
  extension: string
  publicUrl: string
  uploadedAt: string
  downloadCount: number
}

export interface LessonActivity {
  skill: string
  description: string
}

export interface AccessStatus {
  hasAccess: boolean
  isSubscriber: boolean
  hasAcquired: boolean
  userCredits: number
  canAffordWithCredits: boolean
  lessonPrice: number
  creditCost: number
  accessMethod: string
  canRate: boolean
}

export interface Lesson {
  id: number
  title: string
  description: string
  fullDescription?: string
  level: string
  category: string
  duration: string
  rating: number
  downloads: number
  coverImage?: {
    originalName: string
    mimeType: string
    sizeInBytes: number
    width: number
    height: number
    publicUrl: string
    uploadedAt: string
  }
  tags: string[]
  isNew: boolean
  isPremium: boolean
  creditCost: number
  objectives: string[]
  materials: string[]
  procedures: LessonProcedure[]
  assessment: string[]
  activities: LessonActivity[]
  downloadFiles: LessonDownloadFile[]
  viewCount: number
  favoriteCount: number
  author: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
  accessStatus?: AccessStatus
}

export interface LessonsResponse {
  lessons: Lesson[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const getLessons = async (params?: LessonQueryParams): Promise<LessonsResponse> => {
  try {
    const response = await axios.get('/lessons', { params })
    return response.data
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.')
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to view lessons.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to load lessons. Please try again.')
  }
}


export const getLessonById = async (id: number): Promise<Lesson> => {
  try {
    const response = await axios.get(`/lessons/${id}`)
    return response.data
  } catch (error: any) {
    // If API fails, fall back to mock data for development
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.warn('API unavailable, using mock data for lesson', id)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const lesson = mockLessons.find(lesson => lesson.id === id)
      if (!lesson) {
        throw new Error(`Lesson with id ${id} not found`)
      }
      
      return lesson
    }
    
    // Re-throw other errors
    throw error
  }
}



