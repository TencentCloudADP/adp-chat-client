import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'; //导入已经安装的@type/node

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
})
