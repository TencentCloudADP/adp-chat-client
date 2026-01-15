import { ref, onMounted, onUnmounted } from 'vue'
import ADPChatComponent from 'adp-chat-component'
import { defaultConfig } from './config'

export interface UseChatOptions {
  containerId?: string
  getConfig: (state: { isOpen: boolean; isFullscreen: boolean }) => Record<string, unknown>
}

export function useChat(options: UseChatOptions) {
  const { containerId = '#chat-container', getConfig } = options
  
  const instanceRef = ref<unknown>(null)
  const isOpen = ref(false)
  const isFullscreen = ref(false)

  const initChat = () => {
    if (instanceRef.value) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }

    const userConfig = getConfig({ isOpen: isOpen.value, isFullscreen: isFullscreen.value })
    
    instanceRef.value = ADPChatComponent.init(containerId, {
      ...defaultConfig,
      open: isOpen.value,
      isFullscreen: isFullscreen.value,
      ...userConfig,
      onOpenChange: (open: boolean) => {
        isOpen.value = open
        ;(userConfig.onOpenChange as ((open: boolean) => void) | undefined)?.(open)
      },
      onFullscreen: (fullscreen: boolean) => {
        isFullscreen.value = fullscreen
        ;(userConfig.onFullscreen as ((fullscreen: boolean) => void) | undefined)?.(fullscreen)
        initChat()
      },
    })
  }

  const openChat = () => {
    isOpen.value = true
    initChat()
  }

  const closeChat = () => {
    isOpen.value = false
    initChat()
  }

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    initChat()
  }

  onMounted(() => {
    initChat()
  })

  onUnmounted(() => {
    if (instanceRef.value) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }
  })

  return {
    isOpen,
    isFullscreen,
    initChat,
    openChat,
    closeChat,
    toggleFullscreen,
  }
}
