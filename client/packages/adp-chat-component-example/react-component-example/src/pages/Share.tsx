import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ApiConfig } from 'adp-chat-component'
import { ShareChat } from '../components'
import { useUiStore } from '../stores/useUiStore'
import { getBaseURL } from '../config'

const Share: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const { theme } = useUiStore()

  // 如果没有 shareId，跳转到首页
  useEffect(() => {
    if (!shareId) {
      navigate('/home')
    }
  }, [shareId, navigate])

  // API 配置
  const apiConfig: ApiConfig = {
    baseURL: getBaseURL(),
    timeout: 1000 * 60,
    apiDetailConfig: {
      conversationDetailApi: '/chat/messages',
    }
  }

  // 加载失败处理
  const handleLoadError = (error: Error) => {
    console.error('加载分享内容失败:', error)
  }

  if (!shareId) {
    return null
  }

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      }}
    >
      <ShareChat
        shareId={shareId}
        theme={theme}
        apiConfig={apiConfig}
        onLoadError={handleLoadError}
      />
    </div>
  )
}

export default Share
