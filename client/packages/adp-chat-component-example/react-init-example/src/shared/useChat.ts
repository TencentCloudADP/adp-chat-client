import { useEffect, useRef, useState, useCallback } from 'react'
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
  
  const instanceRef = useRef<unknown>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Use refs to track latest state for callbacks
  const stateRef = useRef({ isOpen, isFullscreen })
  stateRef.current = { isOpen, isFullscreen }

  const updateChat = useCallback(() => {
    // 如果还没有初始化，不执行更新
    if (!instanceRef.current) {
      return
    }
    
    const userConfig = getConfig({ isOpen: stateRef.current.isOpen, isFullscreen: stateRef.current.isFullscreen })
    ADPChat.update(containerId, {
      ...userConfig,
      isOverlay: !stateRef.current.isFullscreen,
      isOpen: stateRef.current.isOpen,
    })
  }, [containerId, getConfig])

  const initChat = useCallback(() => {
    // 确保容器存在
    const container = document.querySelector(containerId)
    if (!container) {
      console.warn(`Container ${containerId} not found, retrying...`)
      return
    }

    // 如果已经初始化过，使用 update 方法更新 props
    if (instanceRef.current) {
      updateChat()
      return
    }

    const userConfig = getConfig({ isOpen: stateRef.current.isOpen, isFullscreen: stateRef.current.isFullscreen })
    
    instanceRef.current = ADPChat.init(containerId, {
      ...defaultConfig,
      ...userConfig,
      isOpen: stateRef.current.isOpen,
      isOverlay: !stateRef.current.isFullscreen,
      onOpenChange: (newOpen: boolean) => {
        setIsOpen(newOpen)
        stateRef.current.isOpen = newOpen
        ;(userConfig.onOpenChange as ((open: boolean) => void) | undefined)?.(newOpen)
      },
      onFullscreen: () => {
        const newFullscreen = !stateRef.current.isFullscreen
        setIsFullscreen(newFullscreen)
        stateRef.current.isFullscreen = newFullscreen
        ;(userConfig.onFullscreen as ((fullscreen: boolean) => void) | undefined)?.(newFullscreen)
        // 使用 setTimeout 确保状态更新后再更新配置
        setTimeout(() => updateChat(), 0)
      },
    })
  }, [containerId, getConfig, updateChat])

  const openChat = useCallback(() => {
    setIsOpen(true)
    stateRef.current.isOpen = true
    setTimeout(() => instanceRef.current ? updateChat() : initChat(), 0)
  }, [initChat, updateChat])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    stateRef.current.isOpen = false
    setTimeout(() => instanceRef.current ? updateChat() : initChat(), 0)
  }, [initChat, updateChat])

  const toggleFullscreen = useCallback(() => {
    const newFullscreen = !stateRef.current.isFullscreen
    setIsFullscreen(newFullscreen)
    stateRef.current.isFullscreen = newFullscreen
    setTimeout(() => instanceRef.current ? updateChat() : initChat(), 0)
  }, [initChat, updateChat])

  useEffect(() => {
    // 使用 setTimeout 确保 DOM 准备就绪
    const timer = setTimeout(() => initChat(), 0)
    return () => {
      clearTimeout(timer)
      if (instanceRef.current) {
        try {
          ADPChat.unmount('chat-container-app')
        } catch {
          // ignore
        }
      }
    }
  }, [])

  return {
    isOpen,
    isFullscreen,
    initChat,
    openChat,
    closeChat,
    toggleFullscreen,
  }
}
