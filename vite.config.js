// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ isSsrBuild }) => ({
  ssr: { noExternal: true },
  plugins: [
    react(),
    !isSsrBuild && VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'PrimeFix Solutions',
        short_name: 'PrimeFix',
        description: 'Building and Property Maintenance Services',
        theme_color: '#0a131c',
        background_color: '#0a131c',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}', 'android-chrome-*.png', 'apple-touch-icon.png', 'favicon-*.png'],
        navigateFallback: null,
        navigateFallbackDenylist: [/^\/api\//, /\.(?:xml|txt|vcf)$/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
    modulePreload: {
      // Prevents automatic preload generation for non-essential assets
      filter(filename) {
        return !filename.endsWith('.woff2')
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@fortawesome/')) {
            return 'fontawesome-vendor'
          }
        },
      },
    },
  },
}))