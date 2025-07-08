// Authentication utility functions
export const isAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('accessToken')
  } catch (error) {
    console.error('Error in isAuthenticated:', error)
    return false
  }
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token)
  }
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userRole')
  }
}

export const redirectToLogin = (router: any): void => {
  router.push('/login')
}

// Role-based authentication utilities
export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userRole')
}

export const isAdmin = (): boolean => {
  if (typeof window === 'undefined') return false
  const role = localStorage.getItem('userRole')
  return role === 'admin'
}

export const hasRole = (role: string): boolean => {
  if (typeof window === 'undefined') return false
  const userRole = localStorage.getItem('userRole')
  return userRole === role
}


export const decodeToken = (): any | null => {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  
  try {
    // Decode JWT payload (without verification - this is just for client-side UI purposes)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export const isTokenExpiringSoon = (minutesThreshold: number = 5): boolean => {
  try {
    const payload = decodeToken()
    if (!payload || !payload.exp) return true
    
    const expiryTime = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const thresholdTime = minutesThreshold * 60 * 1000 // Convert minutes to milliseconds
    
    return (expiryTime - now) <= thresholdTime
  } catch {
    return true
  }
}