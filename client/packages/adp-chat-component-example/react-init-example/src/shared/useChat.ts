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

  const initChat = useCallback(() => {
    if (instanceRef.current) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }

    const userConfig = getConfig({ isOpen: stateRef.current.isOpen, isFullscreen: stateRef.current.isFullscreen })
    
    instanceRef.current = ADPChatComponent.init(containerId, {
      ...defaultConfig,
      isOpen: stateRef.current.isOpen,
      isFullscreen: stateRef.current.isFullscreen,
      ...userConfig,
      onOpenChange: (newOpen: boolean) => {
        setIsOpen(newOpen)
        stateRef.current.isOpen = newOpen
        ;(userConfig.onOpenChange as ((open: boolean) => void) | undefined)?.(newOpen)
      },
      onFullscreen: (newFullscreen: boolean) => {
        setIsFullscreen(newFullscreen)
        stateRef.current.isFullscreen = newFullscreen
        ;(userConfig.onFullscreen as ((fullscreen: boolean) => void) | undefined)?.(newFullscreen)
        initChat()
      },
    })
  }, [containerId, getConfig])

  const openChat = useCallback(() => {
    setIsOpen(true)
    stateRef.current.isOpen = true
    initChat()
  }, [initChat])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    stateRef.current.isOpen = false
    initChat()
  }, [initChat])

  const toggleFullscreen = useCallback(() => {
    const newFullscreen = !stateRef.current.isFullscreen
    setIsFullscreen(newFullscreen)
    stateRef.current.isFullscreen = newFullscreen
    initChat()
  }, [initChat])

  useEffect(() => {
    initChat()
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
