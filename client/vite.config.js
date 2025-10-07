import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ubb-enterprise-health-check.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Optimisations pour PWA
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts'],
          forms: ['react-hook-form'],
          toast: ['react-hot-toast']
        }
      }
    },
    // Augmenter la limite de taille pour les chunks
    chunkSizeWarningLimit: 1000,
    // Optimiser les assets
    assetsInlineLimit: 4096,
    // Minifier le CSS
    cssCodeSplit: true,
    // Source maps pour le debug
    sourcemap: false
  },
  // Configuration PWA
  define: {
    __PWA_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
})
