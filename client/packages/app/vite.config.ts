import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isAnalyze = mode === 'analyze'
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx() as any,
      // 打包分析插件，使用 pnpm build --mode analyze 启用
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // 确保依赖去重，避免多个 Vue/TDesign 实例
      dedupe: ['vue', 'tdesign-vue-next'],
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['tdesign-vue-next'],
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
