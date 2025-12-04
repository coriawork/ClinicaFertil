import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/functions/v1': {
        target: 'https://srlgceodssgoifgosyoh.supabase.co',
        changeOrigin: true,
        secure: true,
      },
      '/email/v1': {
        target: 'https://mvvuegssraetbyzeifov.supabase.co/functions',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/email\/v1/, '/v1')
      },
    },
}
})
