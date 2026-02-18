import { defineConfig } from 'vite'

export default defineConfig({
  // Замените 'landing-page' на название вашего репозитория
  base: '/github.io/',
  build: {
    outDir: 'dist',
  },
})
