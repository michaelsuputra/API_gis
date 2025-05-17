import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: ['gis_2205551156.manpits.xyz', 'http://localhost:5173'],
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type']
    },
    allowedHosts: ['gis_2205551156.manpits.xyz']
  }
})
