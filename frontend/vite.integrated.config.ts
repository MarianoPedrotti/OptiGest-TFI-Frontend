import { defineConfig, mergeConfig } from 'vite'
import base from './vite.config'

// Testing-only: no .env files, proxy, production origin or fallback port.
export default mergeConfig(base, defineConfig({
  envDir: false,
  define: { 'import.meta.env.VITE_API_URL': JSON.stringify('http://127.0.0.1:51850/api') },
  server: { host: '127.0.0.1', port: 51851, strictPort: true },
}))
