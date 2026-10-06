import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/university_interactive_study_game_web/',
  plugins: [tanstackRouter({ target: 'react' }), react()],
})
