import axios from "@/lib/axios"
import { mockLessonsResponse, mockFeaturedLessons, mockLessons } from "./mock-data"

export interface LessonQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  level?: string
  isNew?: boolean
  isPremium?: boolean
  authorId?: number
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
  tags?: string[]
  isNew: boolean
  isPremium: boolean
  objectives?: string[]
  materials?: string[]
  procedures?: LessonProcedure[]
  assessment?: string[]
  activities?: LessonActivity[]
  downloadFiles?: LessonDownloadFile[]
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
}

export interface LessonsResponse {
  lessons: Lesson[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const getLessons = async (params?: LessonQueryParams): Promise<LessonsResponse> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get('/lessons', { params })
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Filter mock data based on params
  let filteredLessons = [...mockLessons]
  
  if (params?.search) {
    const searchTerm = params.search.toLowerCase()
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm) ||
      lesson.description.toLowerCase().includes(searchTerm) ||
      lesson.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  if (params?.category) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.category.toLowerCase() === params.category?.toLowerCase()
    )
  }
  
  if (params?.level) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.level.toLowerCase() === params.level?.toLowerCase()
    )
  }
  
  if (params?.isNew !== undefined) {
    filteredLessons = filteredLessons.filter(lesson => lesson.isNew === params.isNew)
  }
  
  if (params?.isPremium !== undefined) {
    filteredLessons = filteredLessons.filter(lesson => lesson.isPremium === params.isPremium)
  }
  
  // Apply pagination
  const page = params?.page || 1
  const limit = params?.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex)
  
  return {
    lessons: paginatedLessons,
    total: filteredLessons.length,
    page,
    limit,
    totalPages: Math.ceil(filteredLessons.length / limit)
  }
}

export const getFeaturedLessons = async (limit = 6): Promise<Lesson[]> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get('/lessons/featured', { params: { limit } })
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockFeaturedLessons.slice(0, limit)
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

export const getMyLessons = async (): Promise<Lesson[]> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get('/lessons/my-lessons')
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Return lessons from current user (mock user id 1)
  return mockLessons.filter(lesson => lesson.author.id === 1)
}

export const getLessonsByAuthor = async (authorId: number): Promise<Lesson[]> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get(`/lessons/author/${authorId}`)
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockLessons.filter(lesson => lesson.author.id === authorId)
}

export const searchLessonsByTags = async (tags: string[]): Promise<Lesson[]> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get('/lessons/search/tags', {
  //   params: { tags: tags.join(',') }
  // })
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const lowerCaseTags = tags.map(tag => tag.toLowerCase())
  return mockLessons.filter(lesson => 
    lesson.tags?.some(tag => 
      lowerCaseTags.some(searchTag => tag.toLowerCase().includes(searchTag))
    )
  )
}