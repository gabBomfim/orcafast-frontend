import api from '../api'

export const proposalService = {
  list(params) {
    return api.get('proposals', { params })
  },

  get(id) {
    return api.get(`proposals/${id}`)
  },

  create(data) {
    return api.post('proposals', data)
  },

  update(id, data) {
    return api.put(`proposals/${id}`, data)
  },

  delete(id) {
    return api.delete(`proposals/${id}`)
  },

  send(id, data) {
    return api.post(`proposals/${id}/send`, data)
  },

  downloadPDF(id) {
    return api.get(`proposals/${id}/download`, { responseType: 'blob' })
  },

  updateStatus(id, status) {
    return api.patch(`proposals/${id}/status`, { status })
  }
}
