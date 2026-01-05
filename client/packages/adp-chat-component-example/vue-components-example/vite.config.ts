import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx() as any,
      createSvgIconsPlugin({
        // 指定 adp-chat-component 的图标目录
        iconDirs: [path.resolve(process.cwd(), '../adp-chat-component/src/assets/icons')],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__',
      }),
      // 移除 TDesignResolver 自动导入，避免与 adp-chat-component 内部导入冲突
      // TDesign 组件改为显式导入
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
