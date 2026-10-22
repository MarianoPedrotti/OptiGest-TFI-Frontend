import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
    exclude: ['tests/**/*.pending.spec.ts'],
    setupFiles: ['./tests/setup.ts'],
    clearMocks: true,
    fileParallelism: false,
    env: { VITE_API_URL: 'http://testing.invalid/blocked' },
  },
})
