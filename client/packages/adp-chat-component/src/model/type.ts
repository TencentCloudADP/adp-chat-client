import type { Application } from './application'
import type { ChatConversation, Record } from './chat'
import type { ApiConfig } from '../service/api'

export interface LanguageOption {
  key: string
  value: string
}

export interface UserInfo {
  avatarUrl?: string
  avatarName?: string
  name?: string
}

export interface ChatConfig {
  container?: string
  canPark?: boolean
  /** 模式类型：full-全屏模式，compact-紧凑模式（固定宽高） */
  modelType?: 'full' | 'compact'
  /** 宽度（仅在 modelType 为 compact 时生效） */
  width?: string | number
  /** 高度（仅在 modelType 为 compact 时生效） */
  height?: string | number
  /** 应用列表 */
  applications?: Application[]
  /** 当前选中的应用 */
  currentApplication?: Application
  /** 会话列表 */
  conversations?: ChatConversation[]
  /** 当前选中的会话 */
  currentConversation?: ChatConversation
  /** 聊天消息列表 */
  chatList?: Record[]
  /** 是否正在聊天中 */
  isChatting?: boolean
  /** 用户信息 */
  user?: UserInfo
  /** 主题模式 */
  theme?: 'light' | 'dark'
  /** 语言选项列表 */
  languageOptions?: LanguageOption[]
  /** 是否为移动端 */
  isMobile?: boolean
  /** Logo URL */
  logoUrl?: string
  /** Logo 标题 */
  logoTitle?: string
  /** 模型选项列表 */
  modelOptions?: any[]
  /** 当前选中的模型 */
  selectModel?: any
  /** 是否启用深度思考模式 */
  isDeepThinking?: boolean
  /** 最大应用显示数量 */
  maxAppLen?: number
  /** AI警告文本 */
  aiWarningText?: string
  /** 新建对话提示文本 */
  createConversationText?: string
  /** 侧边栏国际化文本 */
  sideI18n?: {
    more?: string
    collapse?: string
    today?: string
    recent?: string
    switchTheme?: string
    selectLanguage?: string
    logout?: string
  }
  /** 聊天国际化文本 */
  chatI18n?: {
    loading?: string
    thinking?: string
    checkAll?: string
    shareFor?: string
    copyUrl?: string
    cancelShare?: string
    sendError?: string
    networkError?: string
  }
  /** ChatItem 国际化文本 */
  chatItemI18n?: {
    thinking?: string
    deepThinkingFinished?: string
    deepThinkingExpand?: string
    copy?: string
    replay?: string
    share?: string
    good?: string
    bad?: string
    thxForGood?: string
    thxForBad?: string
    references?: string
  }
  /** Sender 国际化文本 */
  senderI18n?: {
    placeholder?: string
    placeholderMobile?: string
    uploadImg?: string
    startRecord?: string
    stopRecord?: string
    answering?: string
    notSupport?: string
    uploadError?: string
    recordTooLong?: string
  }
  /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
  apiConfig?: ApiConfig
  /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
  autoLoad?: boolean
}
