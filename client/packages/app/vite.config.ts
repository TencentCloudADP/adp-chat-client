import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx() as any,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // 确保依赖去重，避免多个 Vue/TDesign 实例
      dedupe: ['vue', 'tdesign-vue-next', '@tdesign-vue-next/chat'],
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['tdesign-vue-next', '@tdesign-vue-next/chat'],
      // 排除 workspace 包，让其使用源码
      exclude: ['adp-chat-component'],
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.SERVICE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
