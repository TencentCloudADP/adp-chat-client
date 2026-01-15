import { useEffect, useRef, useState, useCallback } from 'react'
import ADPChatComponent from 'adp-chat-component'
import { defaultConfig } from './config'

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

  const initChat = useCallback((open: boolean, fullscreen: boolean) => {
    if (instanceRef.current) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }

    const userConfig = getConfig({ isOpen: open, isFullscreen: fullscreen })
    
    instanceRef.current = ADPChatComponent.init(containerId, {
      ...defaultConfig,
      open,
      isFullscreen: fullscreen,
      ...userConfig,
      onOpenChange: (newOpen: boolean) => {
        setIsOpen(newOpen)
        ;(userConfig.onOpenChange as ((open: boolean) => void) | undefined)?.(newOpen)
      },
      onFullscreen: (newFullscreen: boolean) => {
        setIsFullscreen(newFullscreen)
        ;(userConfig.onFullscreen as ((fullscreen: boolean) => void) | undefined)?.(newFullscreen)
        setTimeout(() => initChat(stateRef.current.isOpen, newFullscreen), 0)
      },
    })
  }, [containerId, getConfig])

  const openChat = useCallback(() => {
    setIsOpen(true)
    initChat(true, stateRef.current.isFullscreen)
  }, [initChat])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    initChat(false, stateRef.current.isFullscreen)
  }, [initChat])

  const toggleFullscreen = useCallback(() => {
    const newFullscreen = !stateRef.current.isFullscreen
    setIsFullscreen(newFullscreen)
    initChat(stateRef.current.isOpen, newFullscreen)
  }, [initChat])

  useEffect(() => {
    initChat(isOpen, isFullscreen)
    return () => {
      if (instanceRef.current) {
        try {
          ADPChatComponent.unmount('chat-container-app')
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
