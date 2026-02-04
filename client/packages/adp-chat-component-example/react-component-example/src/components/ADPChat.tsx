import React, { useEffect, useRef, useId } from 'react'
import ADPChatComponent from 'adp-chat-component'
import type {
  ApiConfig,
  ThemeType,
  Application,
  ChatConversation,
  LanguageOption,
  SideI18n,
  ChatI18n,
  ChatItemI18n,
  SenderI18n,
} from 'adp-chat-component'
import 'adp-chat-component/dist/es/adp-chat-component.css'

export interface ADPChatProps {
  /** API 配置 */
  apiConfig?: ApiConfig
  /** 自动加载数据 */
  autoLoad?: boolean
  /** 主题 */
  theme?: ThemeType
  /** 语言选项 */
  languageOptions?: LanguageOption[]
  /** 侧边栏是否覆盖模式（移动端） */
  isSidePanelOverlay?: boolean
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 是否显示全屏按钮 */
  showOverlayButton?: boolean
  /** Logo URL */
  logoUrl?: string
  /** Logo 标题 */
  logoTitle?: string
  /** 当前应用 ID */
  currentApplicationId?: string
  /** 当前会话 ID */
  currentConversationId?: string
  /** AI 警告文本 */
  aiWarningText?: string
  /** 新建会话文本 */
  createConversationText?: string
  /** 侧边栏国际化 */
  sideI18n?: SideI18n
  /** 聊天国际化 */
  chatI18n?: ChatI18n
  /** 聊天项国际化 */
  chatItemI18n?: ChatItemI18n
  /** 发送框国际化 */
  senderI18n?: SenderI18n
  /** 选择应用回调 */
  onSelectApplication?: (app: Application) => void
  /** 选择会话回调 */
  onSelectConversation?: (conversation: ChatConversation) => void
  /** 新建会话回调 */
  onCreateConversation?: () => void
  /** 切换主题回调 */
  onToggleTheme?: () => void
  /** 切换语言回调 */
  onChangeLanguage?: (key: string) => void
  /** 退出登录回调 */
  onLogout?: () => void
  /** 数据加载完成回调 */
  onDataLoaded?: (type: 'applications' | 'conversations' | 'chatList' | 'user', data: unknown) => void
  /** 会话变化回调 */
  onConversationChange?: (conversationId: string) => void
}

/**
 * ADPChat React 组件
 * 封装 Vue 组件，使其可以在 React 中通过 JSX 方式使用
 */
const ADPChat: React.FC<ADPChatProps> = (props) => {
  const uniqueId = useId()
  const containerId = `adp-chat-${uniqueId.replace(/:/g, '-')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedIdRef = useRef<string | null>(null)

  // 将 props 转换为组件配置
  const getConfig = () => ({
    apiConfig: props.apiConfig,
    autoLoad: props.autoLoad ?? true,
    theme: props.theme ?? 'light',
    languageOptions: props.languageOptions,
    isSidePanelOverlay: props.isSidePanelOverlay ?? true,
    showCloseButton: props.showCloseButton ?? false,
    showOverlayButton: props.showOverlayButton ?? false,
    logoUrl: props.logoUrl,
    logoTitle: props.logoTitle,
    currentApplicationId: props.currentApplicationId ?? '',
    currentConversationId: props.currentConversationId ?? '',
    aiWarningText: props.aiWarningText,
    createConversationText: props.createConversationText,
    sideI18n: props.sideI18n,
    chatI18n: props.chatI18n,
    chatItemI18n: props.chatItemI18n,
    senderI18n: props.senderI18n,
    onSelectApplication: props.onSelectApplication,
    onSelectConversation: props.onSelectConversation,
    onCreateConversation: props.onCreateConversation,
    onToggleTheme: props.onToggleTheme,
    onChangeLanguage: props.onChangeLanguage,
    onLogout: props.onLogout,
    onDataLoaded: props.onDataLoaded,
    onConversationChange: props.onConversationChange,
  })

  useEffect(() => {
    if (!containerRef.current) return

    // 卸载旧实例
    if (mountedIdRef.current) {
      try {
        ADPChatComponent.ADPChat.unmount(mountedIdRef.current)
      } catch {
        // ignore
      }
    }

    // 使用 ADPChat 组件挂载器挂载
    mountedIdRef.current = ADPChatComponent.ADPChat.mount(`#${containerId}`, getConfig()) || null

    return () => {
      if (mountedIdRef.current) {
        try {
          ADPChatComponent.ADPChat.unmount(mountedIdRef.current)
        } catch {
          // ignore
        }
        mountedIdRef.current = null
      }
    }
  }, [
    containerId,
    props.theme,
    props.isSidePanelOverlay,
    props.currentApplicationId,
    props.currentConversationId,
  ])

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default ADPChat
