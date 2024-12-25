import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ski Chart Calculator',
        short_name: 'SkiCalc',
        description: 'Aplicación para calcular configuraciones de esquí.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/sierrast_logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/sierrast_logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/sierrast_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Archivos a cachear
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg)$/, // Ejemplo de imágenes externas
            handler: 'CacheFirst', // Estrategia de caché
          },
        ],
      },
    }),
  ],
})
