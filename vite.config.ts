// vite.config.js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react' // or whatever framework plugin you're using

export default defineConfig({
  plugins: [react()], // adjust based on your framework
  preview: {
    port: 5173,
    strictPort: true,
    host: true, // listen on all addresses
    allowedHosts: ["devicer.punshub.top", "localhost"]
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true, // listen on all addresses
    watch: {
      usePolling: true
    }
  }
})
