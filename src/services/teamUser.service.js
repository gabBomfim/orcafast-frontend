import api from '../api'

export const teamUserService = {
  /**
   * List team members
   * @returns {Promise}
   */
  list: async () => {
    const response = await api.get('/team-users')
    return response.data
  },

  /**
   * Create a new team member
   * @param {Object} data - { name, email }
   * @returns {Promise}
   */
  store: async (data) => {
    const response = await api.post('/team-users', data)
    return response.data
  },

  /**
   * Get member details
   * @param {number} id
   * @returns {Promise}
   */
  show: async (id) => {
    const response = await api.get(`/team-users/${id}`)
    return response.data
  },

  /**
   * Update team member
   * @param {number} id
   * @param {Object} data - { name, email }
   * @returns {Promise}
   */
  update: async (id, data) => {
    const response = await api.put(`/team-users/${id}`, data)
    return response.data
  },

  /**
   * Deactivate team member (Soft delete)
   * @param {number} id
   * @returns {Promise}
   */
  destroy: async (id) => {
    const response = await api.delete(`/team-users/${id}`)
    return response.data
  }
}
