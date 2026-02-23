import api from '../api'

export const goalsService = {
    /**
     * GET /api/goals?year=YYYY
     * Returns goal for the given year, or zeros if none exists yet.
     * Never returns 404.
     */
    get(year) {
        return api.get('goals', { params: { year } })
    },

    /**
     * PUT /api/goals — application/json
     * Creates or updates the goal for the year.
     * @param {object} payload
     * @param {number} payload.year
     * @param {number} payload.annual_target
     * @param {number} payload.monthly_target_default
     * @param {boolean} payload.is_monthly_custom
     * @param {number[]|null} [payload.monthly_targets_custom] — 12-element array, index 0=Jan
     */
    save(payload) {
        return api.put('goals', payload)
    },
}
