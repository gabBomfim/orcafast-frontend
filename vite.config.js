import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'orcafast.com.br',
      'www.orcafast.com.br',
      'api.orcafast.com.br'
    ]
  }
})