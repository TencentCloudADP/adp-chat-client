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

/** 移动端相关 Props（内部组件使用） */
export interface MobileProps {
  /** 是否为移动端（由父组件计算后传入，不对外暴露） */
  isMobile?: boolean
}

/** 浮层相关 Props */
export interface OverlayProps {
  /** 是否显示浮层按钮 */
  showOverlayButton?: boolean
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
  createConversation?: string
  copySuccess?: string
  copyFailed?: string
  shareFailed?: string
  loadMoreFailed?: string
  rateFailed?: string
  getAppListFailed?: string
  getConversationListFailed?: string
  getConversationDetailFailed?: string
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

/** 侧边栏布局 Props */
export interface SidePanelProps {
  /** 侧边栏是否使用overlay模式（覆盖内容区域） */
  isSidePanelOverlay?: boolean
}

/** 通用布局 Props - 组合多个常用 props */
export interface CommonLayoutProps extends ThemeProps, MobileProps, SidePanelProps {}

/** 聊天相关 Props - 组合聊天组件常用 props */
export interface ChatRelatedProps extends CommonLayoutProps {}

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

/** 侧边栏布局 Props 默认值 */
export const sidePanelPropsDefaults = {
  isSidePanelOverlay: true,
}

/** 浮层 Props 默认值 */
export const overlayPropsDefaults = {
  showOverlayButton: true,
}

/** 通用布局 Props 默认值 */
export const commonLayoutPropsDefaults = {
  ...themePropsDefaults,
  ...mobilePropsDefaults,
  ...sidePanelPropsDefaults,
}

/** 聊天相关 Props 默认值 */
export const chatRelatedPropsDefaults = {
  ...commonLayoutPropsDefaults,
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
  createConversation: '新建对话',
  copySuccess: '复制成功',
  copyFailed: '复制失败',
  shareFailed: '分享失败',
  loadMoreFailed: '加载更多失败',
  rateFailed: '评分失败',
  getAppListFailed: '获取应用列表失败',
  getConversationListFailed: '获取会话列表失败',
  getConversationDetailFailed: '获取会话详情失败',
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

// ============================================================
// I18n 英文默认值
// ============================================================

/** 侧边栏 i18n 英文默认值 */
export const defaultSideI18nEn: Required<SideI18n> = {
  more: 'More',
  collapse: 'Collapse',
  today: 'Today',
  recent: 'Recent',
  switchTheme: 'Switch Theme',
  selectLanguage: 'Select Language',
  logout: 'Logout',
}

/** 聊天 i18n 英文默认值 */
export const defaultChatI18nEn: Required<ChatI18n> = {
  loading: 'Loading',
  thinking: 'Thinking',
  checkAll: 'Select All',
  shareFor: 'Share to',
  copyUrl: 'Copy Link',
  cancelShare: 'Cancel Share',
  sendError: 'Send Failed',
  networkError: 'Network Error',
  createConversation: 'New Conversation',
  copySuccess: 'Copied',
  copyFailed: 'Copy Failed',
  shareFailed: 'Share Failed',
  loadMoreFailed: 'Load More Failed',
  rateFailed: 'Rate Failed',
  getAppListFailed: 'Failed to get app list',
  getConversationListFailed: 'Failed to get conversation list',
  getConversationDetailFailed: 'Failed to get conversation detail',
}

/** ChatItem i18n 英文默认值 */
export const defaultChatItemI18nEn: Required<ChatItemI18n> = {
  thinking: 'Thinking',
  deepThinkingFinished: 'Deep thinking completed',
  deepThinkingExpand: 'Expand deep thinking',
  copy: 'Copy',
  replay: 'Regenerate',
  share: 'Share',
  good: 'Like',
  bad: 'Dislike',
  thxForGood: 'Thanks for your feedback',
  thxForBad: 'Thanks for your feedback',
  references: 'References',
}

/** Sender i18n 英文默认值 */
export const defaultSenderI18nEn: Required<SenderI18n> = {
  placeholder: 'Type a message...',
  placeholderMobile: 'Type here',
  uploadImg: 'Upload Image',
  startRecord: 'Start Recording',
  stopRecord: 'Stop Recording',
  answering: 'Answering...',
  notSupport: 'Recording not supported',
  uploadError: 'Upload Failed',
  recordTooLong: 'Recording too long',
}

/** 根据语言获取 i18n 默认值 */
export const getI18nByLanguage = (language: string) => {
  const isEnglish = language.startsWith('en')
  return {
    sideI18n: isEnglish ? defaultSideI18nEn : defaultSideI18n,
    chatI18n: isEnglish ? defaultChatI18nEn : defaultChatI18n,
    chatItemI18n: isEnglish ? defaultChatItemI18nEn : defaultChatItemI18n,
    senderI18n: isEnglish ? defaultSenderI18nEn : defaultSenderI18n,
  }
}

export interface ChatConfig extends ChatRelatedProps, OverlayProps {
  container?: string
  /** 是否为浮层模式：true-使用 width/height 浮动在容器上，false-宽高100%撑满容器 */
  isOverlay?: boolean
  /** 宽度（仅在 isOverlay 为 true 时生效） */
  width?: string | number
  /** 高度（仅在 isOverlay 为 true 时生效） */
  height?: string | number
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 应用列表 */
  applications?: Application[]
  /** 当前选中的应用 */
  currentApplication?: Application
  /** 当前选中的应用 ID（优先级高于 currentApplication） */
  currentApplicationId?: string
  /** 会话列表 */
  conversations?: ChatConversation[]
  /** 当前选中的会话 */
  currentConversation?: ChatConversation
  /** 当前选中的会话 ID（优先级高于 currentConversation） */
  currentConversationId?: string
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
  /** 浮层状态切换回调 */
  onOverlayChange?: (isOverlay: boolean) => void
  /** 主题切换回调 */
  onToggleTheme?: () => void
  /** 语言切换回调 */
  onChangeLanguage?: (key: string) => void
  /** 是否展开面板 */
  isOpen?: boolean
  /** 面板展开状态变化回调 */
  onOpenChange?: (isOpen: boolean) => void
  /** 是否显示悬浮切换按钮 */
  showToggleButton?: boolean
  /** AI警告文本 */
  aiWarningText?: string
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
