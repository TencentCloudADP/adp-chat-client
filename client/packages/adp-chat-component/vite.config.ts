import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 自定义插件：复制 widget 文件到 dist 目录
 */
function copyWidgetPlugin() {
  return {
    name: 'copy-widget',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'public/widget')
      const destDirEs = path.resolve(__dirname, 'dist/es/widget')
      const destDirUmd = path.resolve(__dirname, 'dist/umd/widget')
      
      if (!existsSync(srcDir)) {
        console.warn('Widget source directory not found:', srcDir)
        return
      }

      // 复制到 ES 和 UMD 目录
      for (const destDir of [destDirEs, destDirUmd]) {
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true })
        }
        
        const files = readdirSync(srcDir)
        for (const file of files) {
          copyFileSync(
            path.join(srcDir, file),
            path.join(destDir, file)
          )
        }
        console.log(`Copied widget files to ${destDir}`)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'
  const isUmd = mode === 'umd'
  return {
    plugins: [
      vue(), 
      vueJsx(),
      dts({
        // 指定要编译的 TypeScript 配置文件
        tsconfigPath: './tsconfig.app.json',
        // 输出目录
        outDir: 'dist/types',
        // 包含的文件
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        // 排除的文件
        exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
        // 在构建后清理输出目录
        cleanVueFileName: true,
        // 生成类型声明文件后的回调
        afterBuild: () => {
          console.log('Type declarations generated successfully!')
        }
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹（绝对路径）
        iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
        // 指定 symbolId 的生成格式
        symbolId: 'icon-[name]',
        // （可选）自定义 SVG 雪碧图插入到 HTML 的位置
        inject: 'body-last',
        // （可选）自定义 SVG 雪碧图的 DOM 元素 ID
        customDomId: '__svg__icons__dom__',
      }),
      // 打包分析插件，使用 pnpm build:analyze 启用
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
      // 复制 widget 文件到 dist
      copyWidgetPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: isUmd ? "dist/umd" : "dist/es",
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'ADPChatComponent',
      },
      rollupOptions: {
        // 外部化依赖，不打包进库
        external: isUmd ? [] : ['vue', 'tdesign-vue-next', '@tdesign-vue-next/chat'],
        output: [
          isUmd ? {
            format: 'umd',
            name: 'ADPChatComponent',
            entryFileNames: 'adp-chat-component.umd.js',
            globals: {
              vue: 'Vue',
              'tdesign-vue-next': 'TDesign',
              '@tdesign-vue-next/chat': 'TDesignChat',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'adp-chat-component.css'
              return assetInfo.name || 'assets/[name]-[hash][extname]'
            },
            // UMD 不支持 manualChunks，动态导入会被内联
            inlineDynamicImports: true,
          }
          :
          // ES 格式 - 支持代码分割和按需加载
          {
            format: 'es',
            entryFileNames: 'adp-chat-component.es.js',
            // 使用相对路径，确保 chunk 可以被正确加载
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'adp-chat-component.css'
              return assetInfo.name || 'assets/[name]-[hash][extname]'
            },
            // 手动分包：大体积资源单独打包
            manualChunks(id) {
              // katex 分包
              if (id.includes('katex')) {
                return 'katex'
              }
            },
          },
        ],
      },
      cssCodeSplit: false,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }
})

