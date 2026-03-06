import api from '../api'
import { storage } from '../utils/storage'

// Reads company_id from the stored user so every caller gets it automatically
const getCompanyId = () => {
  const user = storage.getUser()
  return user?.company_id || user?.company?.id
}

export const clientService = {
  list(params) {
    return api.get('clients', { params })
  },

  get(id) {
    return api.get(`clients/${id}`)
  },

  create(data) {
    return api.post('clients', { ...data, company_id: getCompanyId() })
  },

  update(id, data) {
    return api.put(`clients/${id}`, { ...data, company_id: getCompanyId() })
  },

  delete(id) {
    return api.delete(`clients/${id}`)
  }
}
