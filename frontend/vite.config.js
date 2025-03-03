import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // Listen on all IP addresses
    port: 3000,        // Change the port to 3000
    open: true,        // Automatically open the browser
    https: false,      // Enable HTTPS if needed (requires certs)
    proxy: {
      '/api': {
        target: process.env.backend,  // Backend server URL
        changeOrigin: true,  // Set the origin header to the target URL
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),         // Disable SSL verification for local testing (if necessary)
      },
    },
  },
});

