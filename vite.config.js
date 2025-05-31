import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import cssObfuscator from './vite-css-obfuscator.js';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pizzaria da Nonna',
        short_name: 'Pizzaria',
        description: 'A melhor pizzaria da cidade!',
        theme_color: '#ffffff',
        icons: [
          {
            "purpose": "maskable",
            "sizes": "3571.4285714285716x3571.4285714285716",
            "src": "/assets/image/maskable_icon.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "48x48",
            "src": "/assets/image/maskable_icon_x48.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "72x72",
            "src": "/assets/image/maskable_icon_x72.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "96x96",
            "src": "/assets/image/maskable_icon_x96.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "128x128",
            "src": "/assets/image/maskable_icon_x128.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "192x192",
            "src": "/assets/image/maskable_icon_x192.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "384x384",
            "src": "/assets/image/maskable_icon_x384.png",
            "type": "image/png"
          },
          {
            "purpose": "maskable",
            "sizes": "512x512",
            "src": "/assets/image/maskable_icon_x512.png",
            "type": "image/png"
          }
        ]
      }
    }),
    // cssObfuscator(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // base: "/frontend/"
})
