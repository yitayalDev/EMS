import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'EMS Workplace',
        short_name: 'EMS',
        description: 'Employee Management System Portal',
        theme_color: '#4f46e5',
        background_color: '#1f2937',
        display: 'standalone'
      }
    })
  ],
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})
