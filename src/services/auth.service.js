import api from '../api'

export const authService = {
  register(data) {
    return api.post('register', data)
  },

  login(credentials) {
    return api.post('login', credentials)
  },

  logout() {
    return api.post('logout')
  },

  getCurrentUser() {
    return api.get('user')
  },

  forgotPassword(email) {
    return api.post('forgot-password', { email })
  },

  resetPassword(data) {
    return api.post('reset-password', data)
  },
  
  updateProfile(data) {
    return api.put('profile', data)
  },

  resendVerification() {
    return api.post('email/verify/resend')
  },

  updateEmail(email) {
    return api.put('email/verify/update', { email })
  },

  getProfile() {
    return api.get('user')
  },
}
