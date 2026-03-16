import api from '../api'

export const invitationService = {
  /**
   * Validate an invitation token
   * @param {string} token
   * @returns {Promise}
   */
  validate: async (token) => {
    const response = await api.get(`/invitations/${token}`)
    return response.data
  },

  /**
   * Accept an invitation and create account
   * @param {string} token
   * @param {Object} data - { name, password, password_confirmation }
   * @returns {Promise}
   */
  accept: async (token, data) => {
    const response = await api.post(`/invitations/${token}/accept`, data)
    return response.data
  }
}
