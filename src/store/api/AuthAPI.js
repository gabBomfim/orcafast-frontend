import api from '../../api'

export default {
  login(email, password) {
    return api.post('/auth/login', { email, password })
  },

  register(data) {
    return api.post('/auth/register', data)
  },

  logout() {
    return api.post('/auth/logout')
  },

  ping() {
    return api.get('/auth/ping')
  }
}
