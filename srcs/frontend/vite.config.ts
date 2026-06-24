import { defineConfig } from 'vitest/config'
import react          from '@vitejs/plugin-react'
import tailwindcss    from '@tailwindcss/vite'

export default defineConfig({
  plugins : [react(), tailwindcss()],

  server : {
    port : 5178,
    host : '0.0.0.0',
    watch: { usePolling: true },
    hmr  : { host: 'localhost', port: 5178, protocol: 'ws' },
    proxy: {
      '/api'  : 'http://backend:8050',
      '/media': 'http://backend:8050',   // serves Django MEDIA_ROOT files
    },
  },

  build: { outDir: 'dist' },

  test: {
    environment : 'jsdom',
    globals     : true,
    setupFiles  : './src/tests/setup.js',
  },
})
