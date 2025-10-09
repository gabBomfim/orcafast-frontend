import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { authService } from '../services'
import { storage } from '../utils/storage'

export const useAuth = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
    } finally {
      storage.clear()
      navigate('/')
    }
  }

  const getCurrentUser = () => {
    return storage.getUser()
  }

  const isAuthenticated = () => {
    return !!storage.getToken()
  }

  return {
    logout,
    getCurrentUser,
    isAuthenticated,
  }
}
