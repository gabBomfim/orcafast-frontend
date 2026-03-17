import api from '../api'

export const onboardingService = {
  /**
   * POST /onboarding/associate
   * payload: { guest_data: { client, proposal } }
   * returns: { message, proposal_id }
   */
  associate(guestData) {
    return api.post('onboarding/associate', guestData)
  }
}
