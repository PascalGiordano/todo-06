import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Keep root as project directory
  build: {
    outDir: 'dist',
  },
  publicDir: 'public', // Serve static assets from 'public'
  server: {
    port: 3000, // Optional: specify dev server port
  }
})
