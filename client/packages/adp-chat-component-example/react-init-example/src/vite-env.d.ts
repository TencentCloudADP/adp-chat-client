/// <reference types="vite/client" />

declare module 'adp-chat-component' {
  export function configureAxios(config: { baseURL: string; timeout: number }): void
  const ADPChatComponent: {
    init: (container: string, config: Record<string, unknown>) => unknown
    unmount: (containerId: string) => void
  }
  export default ADPChatComponent
}
