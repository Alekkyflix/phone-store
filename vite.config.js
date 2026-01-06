import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/phone-store/',
  server: {
    proxy: {
      '/api/n8n': {
        target: 'https://nairobiaicommunity.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, ''),
        secure: true,
      }
    }
  }
})
