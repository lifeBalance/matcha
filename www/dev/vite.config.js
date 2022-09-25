import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        // target: 'http://127.0.0.1:80',
        target: 'https://127.0.0.1',
        secure: false
      }
    },
  },
  build: {
    outDir: '../public'
  },
  plugins: [
    react(),
    basicSsl()
  ]
})
