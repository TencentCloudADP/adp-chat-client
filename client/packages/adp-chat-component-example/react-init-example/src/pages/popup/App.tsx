import React, { useEffect, useRef, useState, useCallback } from 'react'
import ADPChatComponent from 'adp-chat-component'
import './App.css'

const App: React.FC = () => {
  const instanceRef = useRef<unknown>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const initChat = useCallback((open: boolean, fullscreen: boolean) => {
    if (instanceRef.current) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }

    instanceRef.current = ADPChatComponent.init('#chat-container', {
      canPark: true,
      modelType: 'compact',
      width: fullscreen ? '100%' : 420,
      height: fullscreen ? '100%' : 620,
      theme: 'light',
      logoTitle: 'ADP Chat',
      showFullscreenButton: true,
      showToggleButton: false,
      isFullscreen: fullscreen,
      open: open,
      aiWarningText: '内容由AI生成，仅供参考',
      createConversationText: '新建对话',
      sideI18n: {
        more: '更多',
        collapse: '收起',
        today: '今天',
        recent: '最近',
        switchTheme: '切换主题',
        selectLanguage: '选择语言',
        logout: '退出登录',
      },
      chatI18n: {
        loading: '加载中...',
        thinking: '思考中...',
      },
      chatItemI18n: {
        thinking: '思考中',
        copy: '复制',
      },
      senderI18n: {
        placeholder: '请输入问题...',
      },
      onFullscreen: (fullscreen: boolean) => {
        setIsFullscreen(fullscreen)
        setTimeout(() => initChat(true, fullscreen), 0)
      },
      onOpenChange: (open: boolean) => {
        console.log('Open state changed:', open)
        setIsOpen(open)
        if (!open) {
          setTimeout(() => initChat(false, isFullscreen), 0)
        }
      },
    })
  }, [isFullscreen])

  const openChat = () => {
    setIsOpen(true)
    initChat(true, isFullscreen)
  }

  const closeChat = () => {
    setIsOpen(false)
    initChat(false, isFullscreen)
  }

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

  return (
    <div className="page-container">
      <div className="content">
        <h1>Popup Mode Demo</h1>
        <p>Click the chat button at the bottom right corner to open the chat window</p>
        <p>This mode is suitable for embedding chat functionality in existing pages</p>
        <div className="control-buttons">
          <button className="control-btn" onClick={openChat}>Open Chat</button>
          <button className="control-btn control-btn--secondary" onClick={closeChat}>Close Chat</button>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <span>Floating Button</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Fixed Position Popup</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Closable & Minimizable</span>
          </div>
        </div>
      </div>
      <div id="chat-container"></div>
    </div>
  )
}

export default App
