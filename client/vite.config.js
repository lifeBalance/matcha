import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import vitePluginImp from 'vite-plugin-imp'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:80',
        // target: 'https://127.0.0.1',
        // secure: false
      }
    },
  },
  build: {
    outDir: '../server/public'
  },
  root: './',             // disable before build
  publicDir: '../server/public', // disable before build
  plugins: [
    react(),
    // basicSsl(),
    vitePluginImp()
  ]
})
