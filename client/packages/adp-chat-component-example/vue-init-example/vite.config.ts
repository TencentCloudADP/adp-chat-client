import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx() as any,
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), '../adp-chat-component/src/assets/icons')],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: ['vue', 'tdesign-vue-next', '@tdesign-vue-next/chat'],
    },
    optimizeDeps: {
      include: ['tdesign-vue-next', '@tdesign-vue-next/chat'],
      exclude: ['adp-chat-component'],
    },
    server: {
      host: '0.0.0.0',
      port: 5175,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.SERVICE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
