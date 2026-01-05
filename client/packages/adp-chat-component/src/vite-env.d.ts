/// <reference types="vite/client" />

// vite-plugin-svg-icons 虚拟模块声明
declare module 'virtual:svg-icons-register' {
  const component: any
  export default component
}

declare module 'virtual:svg-icons-names' {
  const names: string[]
  export default names
}
