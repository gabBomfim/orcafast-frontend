import api from '../api'

export const subscriptionService = {
    /** GET /subscription — returns { plan, subscribed, on_grace_period, cancelled, ends_at, trial_ends_at } */
    getStatus() {
        return api.get('subscription')
    },

    /**
     * POST /subscription/checkout
     * @param {string} planSlug - 'pro' | 'business'
     * @param {string} successUrl - path to redirect to after successful checkout
     * Returns { checkout_url } — redirect user to this Stripe Checkout URL
     */
    checkout(planSlug, successUrl = null) {
        const payload = { plan_slug: planSlug }
        if (successUrl) {
            payload.success_url = successUrl
        }
        return api.post('subscription/checkout', payload)
    },

    /** POST /subscription/cancel — cancels at the end of the billing period, no body */
    cancel() {
        return api.post('subscription/cancel')
    },

    /** POST /subscription/resume — reactivates if still in grace period, no body */
    resume() {
        return api.post('subscription/resume')
    },

    /**
     * POST /subscription/portal — no body
     * Returns { portal_url } — redirect user to Stripe Customer Portal
     */
    portal() {
        return api.post('subscription/portal')
    },
}
