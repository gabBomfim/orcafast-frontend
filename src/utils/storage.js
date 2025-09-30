export const storage = {
  getToken() {
    return localStorage.getItem('auth_token')
  },

  setToken(token) {
    localStorage.setItem('auth_token', token)
  },

  removeToken() {
    localStorage.removeItem('auth_token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  removeUser() {
    localStorage.removeItem('user')
  },

  clear() {
    this.removeToken()
    this.removeUser()
  }
}
