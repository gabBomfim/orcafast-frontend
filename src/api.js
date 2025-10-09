import axios from 'axios'
import { API_CONFIG } from './config/api'
import { storage } from './utils/storage'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('login') || error.config?.url?.includes('register')
    
    if (error.response?.status === 401 && !isAuthRoute) {
      storage.clear()
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api