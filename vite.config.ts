// Performance: Regularly analyze bundle size (e.g., using rollup-plugin-visualizer) 
// and ensure tree-shaking is effective for all dependencies.
// Consider code splitting for routes/features if not handled by default.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Example for rollup-plugin-visualizer (install it first)
  // import { visualizer } from 'rollup-plugin-visualizer';
  // build: {
  //   rollupOptions: {
  //     plugins: [visualizer({ open: true })],
  //   },
  // },
  root: '.', // Keep root as project directory
  build: {
    outDir: 'dist',
  },
  publicDir: 'public', // Serve static assets from 'public'
  server: {
    port: 3000, // Optional: specify dev server port
  }
})
