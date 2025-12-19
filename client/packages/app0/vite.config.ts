import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'; //导入已经安装的@type/node
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  define: {
    __VUE_PROD_DEVTOOLS__: true,
  },
  plugins: [
    vue(),
    vueJsx() as any,
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    commonjsOptions: { include: [/markdown-it-texmath/, /node_modules/] },
  },
  optimizeDeps: {
    include: ['markdown-it-texmath'],
  },
  server: {
    proxy: {
      '/application': {
        target: env.SERVICE_API_URL,
        changeOrigin: true,
      },
      '/chat': {
        target: env.SERVICE_API_URL,
        changeOrigin: true,
      },
    },
  },
}})
