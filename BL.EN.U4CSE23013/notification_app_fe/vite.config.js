import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // /eval/* gets forwarded to the evaluation server by Vite dev server
      // This runs server-side so there are no CORS issues
      '/eval': {
        target: 'http://20.207.122.201',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/eval/, '/evaluation-service'),
      },
    },
  },
})
