import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/main.ts', // or 'src/main.js'
      name: 'ADPChatComponent', // Global variable name when used with <script> tag
      fileName: (format) => `adp-chat-component.${format}.js`, // Output file name
      formats: ['es', 'umd'], // 'es' for modern browsers, 'umd' for broader compatibility
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'), // Statically replace NODE_ENV
  },
})
