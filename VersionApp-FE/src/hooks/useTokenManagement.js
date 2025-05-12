import { useAuth } from '@/hooks/useAuth'

/**
 * Custom hook for token management functionality
 */
export function useTokenManagement() {
  const { getIdToken } = useAuth()

  const refreshUserToken = async () => {
    try {
      const newToken = await getIdToken(true)
      if (newToken) {
        localStorage.setItem('token', newToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }

  const ensureValidToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return await refreshUserToken()
      }
      return true
    } catch (error) {
      console.error('Error ensuring valid token:', error)
      return false
    }
  }

  return {
    refreshUserToken,
    ensureValidToken
  }
}