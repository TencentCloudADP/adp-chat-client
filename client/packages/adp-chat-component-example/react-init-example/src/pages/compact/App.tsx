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
      modelType: 'compact',
      width: fullscreen ? '100%' : 800,
      height: fullscreen ? '100%' : 600,
      theme: 'light',
      logoTitle: 'ADP Chat - Compact',
      showFullscreenButton: true,
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
        // 需要重新初始化以更新尺寸
        setTimeout(() => initChat(true, fullscreen), 0)
      },
      onOpenChange: (open: boolean) => {
        console.log('Open state changed:', open)
        setIsOpen(open)
      },
    })
  }, [])

  const openChat = () => {
    setIsOpen(true)
    initChat(true, isFullscreen)
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
    <div className={`page-container ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {!isOpen && (
        <div className="control-panel">
          <h2>Compact Mode Demo</h2>
          <p>Chat panel is closed</p>
          <div className="control-buttons">
            <button className="control-btn" onClick={openChat}>Open Chat</button>
          </div>
        </div>
      )}
      <div className={`chat-wrapper ${isFullscreen ? 'fullscreen-expanded' : ''}`}>
        <div id="chat-container"></div>
      </div>
    </div>
  )
}

export default App
