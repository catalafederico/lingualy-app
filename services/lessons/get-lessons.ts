import axios from "@/lib/axios"
import { mockLessonsResponse, mockFeaturedLessons, mockLessons } from "./mock-data"

export interface LessonQueryParams {
  page?: number
  limit?: number
  search?: string
  subject?: string
  difficulty?: string
  grade?: string
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
  name: string
  type: string
  size: string
  url?: string
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
  grade: string
  subject: string
  duration: string
  difficulty: string
  rating: number
  downloads: number
  previewImage?: string
  tags?: string[]
  isNew: boolean
  isPremium: boolean
  objectives?: string[]
  materials?: string[]
  procedures?: LessonProcedure[]
  assessment?: string[]
  lessonActivities?: LessonActivity[]
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
  
  if (params?.subject) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.subject.toLowerCase() === params.subject?.toLowerCase()
    )
  }
  
  if (params?.grade) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.grade.toLowerCase() === params.grade?.toLowerCase()
    )
  }
  
  if (params?.difficulty) {
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.difficulty.toLowerCase() === params.difficulty?.toLowerCase()
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
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.get(`/lessons/${id}`)
  // return response.data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const lesson = mockLessons.find(lesson => lesson.id === id)
  if (!lesson) {
    throw new Error(`Lesson with id ${id} not found`)
  }
  
  return lesson
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