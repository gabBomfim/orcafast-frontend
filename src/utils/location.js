/**
 * Localização do usuário — usada para enriquecer a sugestão de preço com IA.
 *
 * Fluxo:
 *   1. Pede acesso à geolocalização do navegador (uma vez)
 *   2. Faz reverse-geocoding via BigDataCloud (free, sem API key)
 *   3. Guarda em localStorage no formato "Cidade-UF"
 *   4. Próximas chamadas leem direto do cache
 *
 * Uso:
 *   import { userLocation } from '../utils/location'
 *   const loc = await userLocation.ensure()  // "Salvador-BA" ou ""
 */

const STORAGE_KEY = 'user_location'
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export const userLocation = {
  get() {
    return localStorage.getItem(STORAGE_KEY) || ''
  },

  set(value) {
    if (value) localStorage.setItem(STORAGE_KEY, value)
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },

  async requestFromBrowser() {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) return ''

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
          maximumAge: 1000 * 60 * 60 * 24,
        })
      })

      const { latitude, longitude } = position.coords
      const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
      const response = await fetch(url)
      if (!response.ok) return ''
      const data = await response.json()

      const city = data.city || data.locality || ''
      const stateCode = String(data.principalSubdivisionCode || '').replace('BR-', '')
      const location = city && stateCode ? `${city}-${stateCode}` : city

      if (location) this.set(location)
      return location
    } catch {
      return ''
    }
  },

  async ensure() {
    const stored = this.get()
    if (stored) return stored
    return this.requestFromBrowser()
  },
}
