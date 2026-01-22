import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Application, ChatConversation } from 'adp-chat-component'
import { ADPChat } from '../components'
import { useUiStore } from '../stores/useUiStore'
import {
  apiConfig,
  languageOptions,
  sideI18n,
  chatI18n,
  chatItemI18n,
  senderI18n,
} from '../config'
import Logo from '../assets/favicon.ico'

const Home: React.FC = () => {
  const { applicationId, conversationId } = useParams<{
    applicationId?: string
    conversationId?: string
  }>()
  const navigate = useNavigate()
  const { theme, isMobile, toggleTheme } = useUiStore()

  // 当前选中的应用和会话
  const [currentApplicationId, setCurrentApplicationId] = useState<string>(applicationId || '')
  const [currentConversationId, setCurrentConversationId] = useState<string>(conversationId || '')

  // 同步 URL 参数到状态
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId)
    } else {
      setCurrentApplicationId(applicationId || '')
      setCurrentConversationId('')
    }
  }, [applicationId, conversationId])

  // 更新 URL
  const updateUrl = useCallback((appId: string, convId: string) => {
    if (convId) {
      navigate(`/home/${convId}`)
    } else if (appId) {
      navigate(`/app/${appId}`)
    } else {
      navigate('/home')
    }
  }, [navigate])

  // 事件处理
  const handleSelectApplication = useCallback((app: Application) => {
    const appId = app.ApplicationId || ''
    setCurrentApplicationId(appId)
    setCurrentConversationId('')
    updateUrl(appId, '')
  }, [updateUrl])

  const handleSelectConversation = useCallback((conversation: ChatConversation) => {
    setCurrentConversationId(conversation.Id)
    setCurrentApplicationId(conversation.ApplicationId)
    updateUrl(conversation.ApplicationId, conversation.Id)
  }, [updateUrl])

  const handleCreateConversation = useCallback(() => {
    setCurrentConversationId('')
    updateUrl(currentApplicationId, '')
  }, [currentApplicationId, updateUrl])

  const handleToggleTheme = useCallback(() => {
    toggleTheme()
  }, [toggleTheme])

  const handleChangeLanguage = useCallback((key: string) => {
    console.log('Language changed to:', key)
  }, [])

  const handleLogout = useCallback(() => {
    console.log('Logout clicked')
  }, [])

  const handleDataLoaded = useCallback((type: string, data: unknown) => {
    if (type === 'applications' && Array.isArray(data) && data.length > 0) {
      if (!currentApplicationId && !currentConversationId) {
        const firstAppId = data[0].ApplicationId
        setCurrentApplicationId(firstAppId)
        updateUrl(firstAppId, '')
      }
    }
  }, [currentApplicationId, currentConversationId, updateUrl])

  const handleConversationChange = useCallback((newConversationId: string) => {
    setCurrentConversationId(newConversationId)
    updateUrl(currentApplicationId, newConversationId)
  }, [currentApplicationId, updateUrl])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ADPChat
        apiConfig={apiConfig}
        autoLoad={true}
        theme={theme}
        languageOptions={languageOptions}
        isSidePanelOverlay={isMobile}
        showCloseButton={false}
        showOverlayButton={false}
        logoUrl={Logo}
        currentApplicationId={currentApplicationId}
        currentConversationId={currentConversationId}
        aiWarningText="内容由AI生成，仅供参考"
        createConversationText="新建对话"
        sideI18n={sideI18n}
        chatI18n={chatI18n}
        chatItemI18n={chatItemI18n}
        senderI18n={senderI18n}
        onSelectApplication={handleSelectApplication}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        onToggleTheme={handleToggleTheme}
        onChangeLanguage={handleChangeLanguage}
        onLogout={handleLogout}
        onDataLoaded={handleDataLoaded}
        onConversationChange={handleConversationChange}
      />
    </div>
  )
}

export default Home
