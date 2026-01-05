import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vueJsx(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹（绝对路径）
      iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
      // 指定 symbolId 的生成格式
      symbolId: 'icon-[name]',
      // （可选）自定义 SVG 雪碧图插入到 HTML 的位置
      inject: 'body-last',
      // （可选）自定义 SVG 雪碧图的 DOM 元素 ID
      customDomId: '__svg__icons__dom__',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ADPChatComponent',
      fileName: (format) => `adp-chat-component.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // 外部化依赖，不打包进库
      external: ['vue', 'tdesign-vue-next', '@tdesign-vue-next/chat'],
      output: {
        // 为外部化的依赖提供全局变量
        globals: {
          vue: 'Vue',
          'tdesign-vue-next': 'TDesign',
          '@tdesign-vue-next/chat': 'TDesignChat',
        },
        // 导出 CSS 文件
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'assets/[name]-[hash][extname]'
        },
      },
    },
    cssCodeSplit: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
