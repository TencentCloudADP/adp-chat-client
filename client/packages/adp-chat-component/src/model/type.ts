import type { Application } from './application'
import type { ChatConversation, Record } from './chat'
import type { ApiConfig } from '../service/api'

// ============================================================
// 公共类型定义
// ============================================================

/** 主题类型 */
export type ThemeType = 'light' | 'dark'

/** 语言选项 */
export interface LanguageOption {
  key: string
  value: string
}

/** 用户信息 */
export interface UserInfo {
  avatarUrl?: string
  avatarName?: string
  name?: string
}

// ============================================================
// 公共 Props 接口 - 用于组件间共享的 props 定义
// ============================================================

/** 主题相关 Props */
export interface ThemeProps {
  /** 主题模式 */
  theme?: ThemeType
}

/** 移动端相关 Props */
export interface MobileProps {
  /** 是否为移动端 */
  isMobile?: boolean
}

/** 深度思考相关 Props */
export interface DeepThinkingProps {
  /** 是否启用深度思考模式 */
  isDeepThinking?: boolean
}

/** 全屏相关 Props */
export interface FullscreenProps {
  /** 是否显示全屏按钮 */
  showFullscreenButton?: boolean
  /** 是否处于全屏状态 */
  isFullscreen?: boolean
}

/** 模型选择相关 Props */
export interface ModelSelectProps {
  /** 模型选项列表 */
  modelOptions?: any[]
  /** 当前选中的模型 */
  selectModel?: any
}

/** 侧边栏国际化文本 */
export interface SideI18n {
  more?: string
  collapse?: string
  today?: string
  recent?: string
  switchTheme?: string
  selectLanguage?: string
  logout?: string
}

/** 聊天国际化文本 */
export interface ChatI18n {
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
export interface ChatItemI18n {
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
export interface SenderI18n {
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

/** 通用布局 Props - 组合多个常用 props */
export interface CommonLayoutProps extends ThemeProps, MobileProps {}

/** 聊天相关 Props - 组合聊天组件常用 props */
export interface ChatRelatedProps extends CommonLayoutProps, DeepThinkingProps, ModelSelectProps {}

// ============================================================
// Props 默认值
// ============================================================

/** 主题 Props 默认值 */
export const themePropsDefaults = {
  theme: 'light' as ThemeType,
}

/** 移动端 Props 默认值 */
export const mobilePropsDefaults = {
  isMobile: false,
}

/** 深度思考 Props 默认值 */
export const deepThinkingPropsDefaults = {
  isDeepThinking: true,
}

/** 全屏 Props 默认值 */
export const fullscreenPropsDefaults = {
  showFullscreenButton: false,
  isFullscreen: false,
}

/** 模型选择 Props 默认值 */
export const modelSelectPropsDefaults = {
  modelOptions: () => [] as any[],
  selectModel: null,
}

/** 通用布局 Props 默认值 */
export const commonLayoutPropsDefaults = {
  ...themePropsDefaults,
  ...mobilePropsDefaults,
}

/** 聊天相关 Props 默认值 */
export const chatRelatedPropsDefaults = {
  ...commonLayoutPropsDefaults,
  ...deepThinkingPropsDefaults,
  ...modelSelectPropsDefaults,
}

/** 默认语言选项 */
export const defaultLanguageOptions: LanguageOption[] = [
  { key: 'zh-CN', value: '简体中文' },
  { key: 'en-US', value: 'English' },
]

// ============================================================
// I18n 默认值
// ============================================================

/** 侧边栏 i18n 默认值 */
export const defaultSideI18n: Required<SideI18n> = {
  more: '更多',
  collapse: '收起',
  today: '今天',
  recent: '最近',
  switchTheme: '切换主题',
  selectLanguage: '选择语言',
  logout: '退出登录',
}

/** 聊天 i18n 默认值 */
export const defaultChatI18n: Required<ChatI18n> = {
  loading: '加载中',
  thinking: '思考中',
  checkAll: '全选',
  shareFor: '分享至',
  copyUrl: '复制链接',
  cancelShare: '取消分享',
  sendError: '发送失败',
  networkError: '网络错误',
}

/** ChatItem i18n 默认值 */
export const defaultChatItemI18n: Required<ChatItemI18n> = {
  thinking: '思考中',
  deepThinkingFinished: '深度思考完成',
  deepThinkingExpand: '展开深度思考',
  copy: '复制',
  replay: '重新生成',
  share: '分享',
  good: '点赞',
  bad: '踩',
  thxForGood: '感谢您的反馈',
  thxForBad: '感谢您的反馈',
  references: '参考来源',
}

/** Sender i18n 默认值 */
export const defaultSenderI18n: Required<SenderI18n> = {
  placeholder: '请输入消息...',
  placeholderMobile: '请输入',
  uploadImg: '上传图片',
  startRecord: '点击开始录音',
  stopRecord: '点击停止录音',
  answering: '回答中...',
  notSupport: '当前浏览器不支持录音',
  uploadError: '上传失败',
  recordTooLong: '录音时长超过限制',
}

export interface ChatConfig extends ChatRelatedProps, FullscreenProps {
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
  /** 语言选项列表 */
  languageOptions?: LanguageOption[]
  /** Logo URL */
  logoUrl?: string
  /** Logo 标题 */
  logoTitle?: string
  /** 最大应用显示数量 */
  maxAppLen?: number
  /** 全屏状态切换回调 */
  onFullscreen?: (isFullscreen: boolean) => void
  /** 是否展开面板（仅在 canPark 模式下生效） */
  open?: boolean
  /** 面板展开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 是否显示悬浮切换按钮 */
  showToggleButton?: boolean
  /** AI警告文本 */
  aiWarningText?: string
  /** 新建对话提示文本 */
  createConversationText?: string
  /** 侧边栏国际化文本 */
  sideI18n?: SideI18n
  /** 聊天国际化文本 */
  chatI18n?: ChatI18n
  /** ChatItem 国际化文本 */
  chatItemI18n?: ChatItemI18n
  /** Sender 国际化文本 */
  senderI18n?: SenderI18n
  /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
  apiConfig?: ApiConfig
  /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
  autoLoad?: boolean
}
