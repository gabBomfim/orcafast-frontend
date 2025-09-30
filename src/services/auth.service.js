import api from '../api'

export const authService = {
  register(data) {
    return api.post('/register', data)
  },

  login(credentials) {
    return api.post('/login', credentials)
  },

  logout() {
    return api.post('/logout')
  },

  getCurrentUser() {
    return api.get('/user')
  }
}
