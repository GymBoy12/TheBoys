import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

// Definir la versión de la PWA
const version = '1.1.0';

export default defineConfig({
  base: '/gymboy/' , // Usar base solo en producción
  plugins: [
    react(),
    VitePWA({
      manifest: {
        display: 'standalone',
        display_override: ['windows-controls-overlay'],
        lang: 'es-ES',
        name: 'gymboy',
        short_name: 'Gym',
        description: 'PWA creada',
        theme_color: '#19223c',
        background_color: '#d4d4d4',
        start_url: '/gymboy/', // Cambiado el valor de start_url
        screenshots: [
          {
            src: '/gymboy/screenshot1.png', // Corregida la ruta de la imagen
            sizes: '1365x603',
            type: 'image/png',
          },
        ],
        icons: [
          {
            src: '/gymboy/logo60x60.png', // Corregida la ruta del icono
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: '/gymboy/logo192x192.png', // Corregida la ruta del icono
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/gymboy/logo512x512.png', // Corregida la ruta del icono
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // Agregar la versión personalizada
        version: version,
      },
        // Configuración de Workbox sin la opción 'strategies'
      workbox: {},
    }),
  ],
});
