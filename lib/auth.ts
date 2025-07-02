// Authentication utility functions
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
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
  }
}

export const redirectToLogin = (router: any): void => {
  router.push('/login')
}