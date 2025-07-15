import axios from "@/lib/axios"

export interface AcquireLessonResponse {
  message: string
  success: boolean
}

export interface CreateLessonCheckoutResponse {
  sessionId: string
  url: string
  checkoutId: number
}

/**
 * Acquire a lesson using credits
 */
export const acquireLesson = async (lessonId: number): Promise<AcquireLessonResponse> => {
  try {
    const response = await axios.post(`/lessons/${lessonId}/acquire`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in to acquire lessons.')
    }
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message
      if (message?.includes('Insufficient credits')) {
        throw new Error('You do not have enough credits to acquire this lesson.')
      }
      if (message?.includes('already acquired')) {
        throw new Error('You already have access to this lesson.')
      }
      if (message?.includes('Free lessons')) {
        throw new Error('Free lessons cannot be acquired.')
      }
      throw new Error(message || 'Unable to acquire lesson.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    throw new Error(error.response?.data?.message || 'Failed to acquire lesson. Please try again.')
  }
}

/**
 * Create a checkout session for purchasing a lesson
 */
export const createLessonCheckout = async (lessonId: number): Promise<CreateLessonCheckoutResponse> => {
  try {
    const response = await axios.post(`/checkouts/lesson/${lessonId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in to purchase lessons.')
    }
    
    if (error.response?.status === 400) {
      const message = error.response?.data?.message
      if (message?.includes('already acquired')) {
        throw new Error('You already have access to this lesson.')
      }
      if (message?.includes('free lessons')) {
        throw new Error('Free lessons cannot be purchased.')
      }
      throw new Error(message || 'Unable to create checkout session.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create checkout session. Please try again.')
  }
}