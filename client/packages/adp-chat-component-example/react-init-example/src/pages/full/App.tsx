import React, { useEffect, useRef, useState } from 'react'
import ADPChatComponent from 'adp-chat-component'
import './App.css'

const App: React.FC = () => {
  const instanceRef = useRef<unknown>(null)
  const [isOpen, setIsOpen] = useState(false)

  const initChat = (open: boolean) => {
    if (instanceRef.current) {
      try {
        ADPChatComponent.unmount('chat-container-app')
      } catch {
        // ignore
      }
    }

    instanceRef.current = ADPChatComponent.init('#chat-container', {
      modelType: 'full',
      theme: 'light',
      logoTitle: 'ADP Chat - Full Mode',
      showFullscreenButton: false,
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
        sendError: '发送失败',
        networkError: '网络错误',
      },
      chatItemI18n: {
        thinking: '思考中',
        copy: '复制',
        replay: '重新生成',
        share: '分享',
        good: '有帮助',
        bad: '没帮助',
      },
      senderI18n: {
        placeholder: '请输入您的问题...',
        uploadImg: '上传图片',
        answering: '回答中...',
      },
      onOpenChange: (open: boolean) => {
        console.log('Open state changed:', open)
        setIsOpen(open)
      },
    })
  }

  const openChat = () => {
    setIsOpen(true)
    initChat(true)
  }

  useEffect(() => {
    initChat(isOpen)
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
      {!isOpen && (
        <div className="control-panel">
          <h2>Full Mode Demo</h2>
          <p>Chat panel is closed</p>
          <div className="control-buttons">
            <button className="control-btn" onClick={openChat}>Open Chat</button>
          </div>
        </div>
      )}
      <div id="chat-container" className="chat-container"></div>
    </div>
  )
}

export default App
