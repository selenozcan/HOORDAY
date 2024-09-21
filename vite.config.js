import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  // Set the environment to jsdom (for React)
    globals: true,         // Enable global `describe`, `it`, `expect`, etc.
    setupFiles: './src/setupTests.js',  // Ensure your setup file is loaded
  },
});
