import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import mkcert from 'vite-plugin-mkcert'
import path from 'path';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 通过环境变量判断是否启用 HTTPS
  const isHttps = process.env.VITE_HTTPS === 'true'
  
  return {
    base: './',
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹（绝对路径）
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定 symbolId 的生成格式
        // [name] 为 SVG 文件名，[dir] 为相对于 iconDirs 的目录名
        symbolId: 'icon-[dir]-[name]',
        // （可选）自定义 SVG 雪碧图插入到 HTML 的位置，默认为 'body-last'
        inject: 'body-last',
        // （可选）自定义 SVG 雪碧图的 DOM 元素 ID，默认为 '__svg__icons__dom__'
        customDomId: '__svg__icons__dom__',
      }),
      vueJsx() as any,
      vueDevTools(),
      AutoImport({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      // 仅在 HTTPS 模式下启用 mkcert
      ...(isHttps ? [mkcert()] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: isHttps ? 5174 : 5173,
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
