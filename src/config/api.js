const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_URL = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 10000,
}

export default API_CONFIG
