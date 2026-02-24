import api from '../api'

export const dashboardService = {
    /**
     * GET /api/dashboard
     * @param {object} params
     * @param {string} params.period   - 'this-month' | 'last-month' | 'this-year' | 'custom'
     * @param {string} [params.begin_date] - YYYY-MM-DD (required when period='custom')
     * @param {string} [params.end_date]   - YYYY-MM-DD (required when period='custom')
     */
    get(params) {
        return api.get('dashboard', { params })
    },
}
