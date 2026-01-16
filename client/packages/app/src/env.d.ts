/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.css' {
  const css: string
  export default css
}

declare module '*.ico' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
