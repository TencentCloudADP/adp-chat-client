import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ADPChatComponent from 'adp-chat-component'
import { defaultConfig } from './config'

// 扩展类型以包含 update 方法
type ADPChatComponentType = typeof ADPChatComponent & {
  update: (container?: string, config?: Record<string, unknown>) => boolean
}
const ADPChat = ADPChatComponent as ADPChatComponentType

export interface UseChatOptions {
  containerId?: string
  getConfig: (state: { isOpen: boolean; isFullscreen: boolean }) => Record<string, unknown>
}

export function useChat(options: UseChatOptions) {
  const { containerId = '#chat-container', getConfig } = options
  
  const instanceRef = ref<unknown>(null)
  const isOpen = ref(false)
  const isFullscreen = ref(false)

  const updateChat = () => {
    // 如果还没有初始化，不执行更新
    if (!instanceRef.value) {
      return
    }
    
    const userConfig = getConfig({ isOpen: isOpen.value, isFullscreen: isFullscreen.value })
    ADPChat.update(containerId, {
      ...userConfig,
      isOpen: isOpen.value,
      isOverlay: !isFullscreen.value,
    })
  }

  const initChat = () => {
    // 确保容器存在
    const container = document.querySelector(containerId)
    if (!container) {
      console.warn(`Container ${containerId} not found, retrying...`)
      return
    }

    // 如果已经初始化过，使用 update 方法更新 props
    if (instanceRef.value) {
      updateChat()
      return
    }

    const userConfig = getConfig({ isOpen: isOpen.value, isFullscreen: isFullscreen.value })
    
    instanceRef.value = ADPChat.init(containerId, {
      ...defaultConfig,
      ...userConfig,
      isOpen: isOpen.value,
      isOverlay: !isFullscreen.value,
      onOpenChange: (open: boolean) => {
        isOpen.value = open
        ;(userConfig.onOpenChange as ((open: boolean) => void) | undefined)?.(open)
      },
      onFullscreen: () => {
        isFullscreen.value = !isFullscreen.value
        ;(userConfig.onFullscreen as ((fullscreen: boolean) => void) | undefined)?.(isFullscreen.value)
        nextTick(() => updateChat())
      },
    })
  }

  const openChat = () => {
    isOpen.value = true
    nextTick(() => instanceRef.value ? updateChat() : initChat())
  }

  const closeChat = () => {
    isOpen.value = false
    nextTick(() => instanceRef.value ? updateChat() : initChat())
  }

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    nextTick(() => instanceRef.value ? updateChat() : initChat())
  }

  onMounted(() => {
    nextTick(() => initChat())
  })

  onUnmounted(() => {
    if (instanceRef.value) {
      try {
        ADPChat.unmount('chat-container-app')
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
