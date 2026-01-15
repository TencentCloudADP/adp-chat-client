/// <reference types="vite/client" />

// vue-infinite-loading 模块声明
declare module 'vue-infinite-loading' {
  import { DefineComponent } from 'vue'
  const InfiniteLoading: DefineComponent<{
    identifier?: string | number
    direction?: 'top' | 'bottom'
    distance?: number
    spinner?: string
    forceUseInfiniteWrapper?: boolean | string
  }, {}, {}>
  export default InfiniteLoading
}

// SVG 原始内容导入声明
declare module '*.svg?raw' {
  const content: string
  export default content
}

// vite-plugin-svg-icons 虚拟模块声明
declare module 'virtual:svg-icons-register' {
  const component: any
  export default component
}

declare module 'virtual:svg-icons-names' {
  const names: string[]
  export default names
}
