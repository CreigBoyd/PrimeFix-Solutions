// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      // The plugin generates /manifest.webmanifest and injects the <link> tag.
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
        // Precache only the app shell. Photos are large, so they're cached on first use instead.
        globPatterns: ['**/*.{js,css,html,ico,svg}', 'android-chrome-*.png', 'apple-touch-icon.png', 'favicon-*.png'],
        // Don't let the SPA fallback swallow the API or plain static files.
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
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-styles' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    // Local dev: /api/* -> PHP built-in server (npm run dev:php)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
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
})
