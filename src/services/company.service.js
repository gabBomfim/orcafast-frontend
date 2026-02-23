import api from '../api'
import { API_CONFIG } from '../config/api'

// The backend always returns logo_url with its own server host (e.g. localhost:80).
// We need to swap the origin to the configured API host so the browser can load it.
const normalizeLogoUrl = (url) => {
    if (!url) return null
    try {
        const apiOrigin = new URL(API_CONFIG.BASE_URL).origin
        const parsed = new URL(url)
        return `${apiOrigin}${parsed.pathname}`
    } catch {
        return url
    }
}

export const companyService = {
    /**
     * GET /api/company
     * Returns company data including logo_url and plan.
     */
    async get() {
        const res = await api.get('company')
        if (res.data?.logo_url) res.data.logo_url = normalizeLogoUrl(res.data.logo_url)
        return res
    },

    /**
     * POST /api/company  (multipart/form-data)
     * Updates company info. Always multipart because of optional logo upload.
     * @param {FormData} formData
     */
    async update(formData) {
        const res = await api.post('company', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.data?.logo_url) res.data.logo_url = normalizeLogoUrl(res.data.logo_url)
        return res
    },

    /**
     * DELETE /api/company/logo
     * Removes the current company logo.
     */
    deleteLogo() {
        return api.delete('company/logo')
    },
}
