/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Psychometry-Words/',
  plugins: [react(), tailwindcss()],
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
})
