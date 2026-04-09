import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'node:path'
import { existsSync, copyFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 自定义插件：从 adp-chat-component 复制 widget 文件到 app 的构建输出目录
 */
function copyWidgetFromComponentPlugin() {
  return {
    name: 'copy-widget-from-component',
    closeBundle() {
      // 生产构建时从 adp-chat-component 复制 widget 文件
      const componentWidgetDir = path.resolve(__dirname, '../adp-chat-component/public/widget')
      const destDir = path.resolve(__dirname, 'dist/widget')
      
      if (!existsSync(componentWidgetDir)) {
        console.warn('Widget source directory not found:', componentWidgetDir)
        return
      }

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true })
      }
      
      const files = readdirSync(componentWidgetDir)
      for (const file of files) {
        copyFileSync(
          path.join(componentWidgetDir, file),
          path.join(destDir, file)
        )
      }
      console.log(`Copied widget files from adp-chat-component to ${destDir}`)
    }
  }
}

/**
 * 自定义插件：开发时服务 adp-chat-component 的 widget 静态资源
 */
function serveWidgetPlugin() {
  const widgetDir = path.resolve(__dirname, '../adp-chat-component/public/widget')
  
  return {
    name: 'serve-widget',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // 处理 /widget/ 路径的请求
        if (req.url?.startsWith('/widget/')) {
          const fileName = req.url.replace('/widget/', '')
          const filePath = path.join(widgetDir, fileName)
          
          if (existsSync(filePath)) {
            const content = readFileSync(filePath)
            const ext = path.extname(fileName)
            const contentType = ext === '.js' ? 'application/javascript' : 'text/plain'
            res.setHeader('Content-Type', contentType)
            res.end(content)
            return
          }
        }
        next()
      })
    }
  }
}

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
      // 开发时服务 widget 静态资源
      serveWidgetPlugin(),
      // 构建时复制 widget 文件
      copyWidgetFromComponentPlugin(),
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
