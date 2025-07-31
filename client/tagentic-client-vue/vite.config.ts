import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'; //导入已经安装的@type/node
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_DEVTOOLS__: true,
  },
  plugins: [
    vue(),
    vueJsx({}),
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
})
