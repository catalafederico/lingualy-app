import axios from "@/lib/axios";
import {
  Lesson,
  LessonProcedure,
  LessonDownloadFile,
  LessonActivity,
} from "./get-lessons";
import { mockLessons } from "./mock-data";

// Helper function for file size formatting
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export interface CreateLessonData {
  title: string;
  description: string;
  fullDescription?: string;
  level: string;
  category: string;
  duration: string;
  previewImage?: string;
  tags?: string[];
  isNew?: boolean;
  isPremium?: boolean;
  objectives?: string[];
  materials?: string[];
  procedures?: LessonProcedure[];
  assessment?: string[];
  activities?: LessonActivity[];
  downloadFiles?: LessonDownloadFile[];
  action?: 'save' | 'publish';
}

export const createLesson = async (data: CreateLessonData): Promise<Lesson> => {
  // Temporary mock data - replace with real API call when backend is ready
  // const response = await axios.post('/lessons', data)
  // return response.data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Create a new lesson with mock data
  const newLesson: Lesson = {
    id: Math.max(...mockLessons.map((l) => l.id)) + 1,
    title: data.title,
    description: data.description,
    fullDescription: data.fullDescription || "",
    level: data.level,
    category: data.category,
    duration: data.duration,
    rating: 0,
    downloads: 0,
    coverImage: data.previewImage ? {
      originalName: "cover.jpg",
      mimeType: "image/jpeg",
      sizeInBytes: 1024,
      width: 300,
      height: 200,
      publicUrl: data.previewImage,
      uploadedAt: new Date().toISOString()
    } : undefined,
    tags: data.tags || [],
    isNew: data.isNew || true,
    isPremium: data.isPremium || false,
    objectives: data.objectives || [],
    materials: data.materials || [],
    procedures: data.procedures || [],
    assessment: data.assessment || [],
    activities: data.activities || [],
    downloadFiles: data.downloadFiles || [],
    viewCount: 0,
    favoriteCount: 0,
    author: {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock lessons array (in real app this would be handled by the backend)
  mockLessons.unshift(newLesson);

  return newLesson;
};

export const createLessonWithFiles = async (
  lessonData: Omit<CreateLessonData, 'previewImage' | 'downloadFiles'>,
  coverImage?: File,
  downloadFiles?: File[]
): Promise<Lesson> => {
  try {
    // Use multipart/form-data for file uploads
    const formData = new FormData()
    
    // Append individual lesson data fields
    if (lessonData.title !== undefined) formData.append('title', lessonData.title)
    if (lessonData.description !== undefined) formData.append('description', lessonData.description)
    if (lessonData.fullDescription !== undefined) formData.append('fullDescription', lessonData.fullDescription)
    if (lessonData.level !== undefined) formData.append('level', lessonData.level)
    if (lessonData.category !== undefined) formData.append('category', lessonData.category)
    if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration)
    if (lessonData.action !== undefined) formData.append('action', lessonData.action)
    if (lessonData.isPremium !== undefined) formData.append('isPremium', lessonData.isPremium.toString())
    
    // Append arrays as JSON strings
    if (lessonData.tags) formData.append('tags', JSON.stringify(lessonData.tags))
    if (lessonData.objectives) formData.append('objectives', JSON.stringify(lessonData.objectives))
    if (lessonData.materials) formData.append('materials', JSON.stringify(lessonData.materials))
    if (lessonData.procedures) formData.append('procedures', JSON.stringify(lessonData.procedures))
    if (lessonData.assessment) formData.append('assessment', JSON.stringify(lessonData.assessment))
    if (lessonData.activities) formData.append('activities', JSON.stringify(lessonData.activities))
    
    // Append files
    if (coverImage) formData.append('coverImage', coverImage)
    downloadFiles?.forEach(file => formData.append('downloadFiles', file))
    
    const response = await axios.post('/lessons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.')
    }
    
    if (error.response?.status === 413) {
      throw new Error('File size too large. Please reduce file sizes and try again.')
    }
    
    if (error.response?.status === 400) {
      throw new Error('Invalid lesson data. Please check all required fields and try again.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.')
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to create lessons.')
    }
    
    if (error.response?.status === 422) {
      throw new Error('Validation failed. Please check your input data and try again.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to create lesson. Please try again.')
  }
};

export const updateLesson = async (
  id: number,
  data: Partial<CreateLessonData>
): Promise<Lesson> => {
  const response = await axios.patch(`/lessons/${id}`, data);
  return response.data;
};

export const updateLessonWithFiles = async (
  id: number,
  lessonData: Partial<Omit<CreateLessonData, 'previewImage' | 'downloadFiles'>>,
  coverImage?: File,
  downloadFiles?: File[],
  removedFileIds?: string[]
): Promise<Lesson> => {
  try {
    // Use multipart/form-data for file uploads
    const formData = new FormData()
    
    // Append individual lesson data fields
    if (lessonData.title !== undefined) formData.append('title', lessonData.title)
    if (lessonData.description !== undefined) formData.append('description', lessonData.description)
    if (lessonData.fullDescription !== undefined) formData.append('fullDescription', lessonData.fullDescription)
    if (lessonData.level !== undefined) formData.append('level', lessonData.level)
    if (lessonData.category !== undefined) formData.append('category', lessonData.category)
    if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration)
    if (lessonData.action !== undefined) formData.append('action', lessonData.action)
    if (lessonData.isPremium !== undefined) formData.append('isPremium', lessonData.isPremium.toString())
    
    // Append arrays as JSON strings
    if (lessonData.tags) formData.append('tags', JSON.stringify(lessonData.tags))
    if (lessonData.objectives) formData.append('objectives', JSON.stringify(lessonData.objectives))
    if (lessonData.materials) formData.append('materials', JSON.stringify(lessonData.materials))
    if (lessonData.procedures) formData.append('procedures', JSON.stringify(lessonData.procedures))
    if (lessonData.assessment) formData.append('assessment', JSON.stringify(lessonData.assessment))
    if (lessonData.activities) formData.append('activities', JSON.stringify(lessonData.activities))
    
    // Append files
    if (coverImage) formData.append('coverImage', coverImage)
    downloadFiles?.forEach(file => formData.append('downloadFiles', file))
    if (removedFileIds?.length) formData.append('removedFiles', JSON.stringify(removedFileIds))
    
    const response = await axios.patch(`/lessons/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Lesson not found. It may have been deleted or moved.')
    }
    
    if (error.response?.status === 413) {
      throw new Error('File size too large. Please reduce file sizes and try again.')
    }
    
    if (error.response?.status === 400) {
      throw new Error('Invalid lesson data. Please check all required fields and try again.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.')
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to edit this lesson.')
    }
    
    if (error.response?.status === 422) {
      throw new Error('Validation failed. Please check your input data and try again.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to update lesson. Please try again.')
  }
};

export const getLessonById = async (id: number): Promise<Lesson> => {
  try {
    const response = await axios.get(`/lessons/${id}`)
    return response.data
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Lesson not found. It may have been deleted or moved.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.')
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to view this lesson.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to load lesson. Please try again.')
  }
};

export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/lessons/${id}`);
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Lesson not found. It may have been already deleted.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to delete this lesson.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to delete lesson. Please try again.');
  }
};

export const downloadLesson = async (id: number): Promise<Lesson> => {
  const response = await axios.post(`/lessons/${id}/download`);
  return response.data;
};

export const rateLesson = async (id: number, rating: number): Promise<void> => {
  await axios.post(`/lessons/${id}/rate`, { rating });
};

export const getDraftLessons = async (): Promise<Lesson[]> => {
  try {
    const response = await axios.get('/lessons/drafts');
    return response.data;
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to view draft lessons.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to load draft lessons. Please try again.');
  }
};

export const publishLesson = async (
  id: number,
  lessonData: Omit<CreateLessonData, 'previewImage' | 'downloadFiles'>,
  coverImage?: File,
  downloadFiles?: File[],
  removedFileIds?: string[]
): Promise<Lesson> => {
  try {
    // Use multipart/form-data for file uploads
    const formData = new FormData()
    
    // Append individual lesson data fields
    if (lessonData.title !== undefined) formData.append('title', lessonData.title)
    if (lessonData.description !== undefined) formData.append('description', lessonData.description)
    if (lessonData.fullDescription !== undefined) formData.append('fullDescription', lessonData.fullDescription)
    if (lessonData.level !== undefined) formData.append('level', lessonData.level)
    if (lessonData.category !== undefined) formData.append('category', lessonData.category)
    if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration)
    if (lessonData.isPremium !== undefined) formData.append('isPremium', lessonData.isPremium.toString())
    
    // Append arrays as JSON strings
    if (lessonData.tags) formData.append('tags', JSON.stringify(lessonData.tags))
    if (lessonData.objectives) formData.append('objectives', JSON.stringify(lessonData.objectives))
    if (lessonData.materials) formData.append('materials', JSON.stringify(lessonData.materials))
    if (lessonData.procedures) formData.append('procedures', JSON.stringify(lessonData.procedures))
    if (lessonData.assessment) formData.append('assessment', JSON.stringify(lessonData.assessment))
    if (lessonData.activities) formData.append('activities', JSON.stringify(lessonData.activities))
    
    // Append files
    if (coverImage) formData.append('coverImage', coverImage)
    downloadFiles?.forEach(file => formData.append('downloadFiles', file))
    if (removedFileIds?.length) formData.append('removedFiles', JSON.stringify(removedFileIds))
    
    const response = await axios.post(`/lessons/${id}/publish`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error: any) {
    // Handle specific error types
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet connection and try again.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Lesson not found. It may have been deleted or moved.')
    }
    
    if (error.response?.status === 413) {
      throw new Error('File size too large. Please reduce file sizes and try again.')
    }
    
    if (error.response?.status === 400) {
      throw new Error('Invalid lesson data. Please check all required fields and try again.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.')
    }
    
    if (error.response?.status === 403) {
      throw new Error('Permission denied. You do not have access to publish this lesson.')
    }
    
    if (error.response?.status === 422) {
      throw new Error('Validation failed. Please check your input data and try again.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    // Generic error fallback
    throw new Error(error.response?.data?.message || 'Failed to publish lesson. Please try again.')
  }
};
