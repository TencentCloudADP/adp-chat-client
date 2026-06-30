import type { Application } from './application'
import type { ChatConversation, Record } from './chat-v2'
import type { ApiConfig } from '../service/api'

// ============================================================
// 公共类型定义
// ============================================================

/** 主题类型 */
export type ThemeType = 'light' | 'dark'

/** 聊天模式：claw-简化模式（无文件预览/无解析进度），standard-标准模式（有解析进度） */
export type ChatMode = 'claw' | 'standard'

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
  uploading?:string;
  loading?: string
  thinking?: string
  checkAll?: string
  shareFor?: string
  copyUrl?: string
  cancelShare?: string
  sendError?: string
  networkError?: string
  loginExpired?: string
  createConversation?: string
  copySuccess?: string
  copyFailed?: string
  /** 复制按钮 title */
  copy?: string
  /** 查看按钮文本 */
  view?: string
  shareFailed?: string
  loadMoreFailed?: string
  rateFailed?: string
  getAppListFailed?: string
  getConversationListFailed?: string
  getConversationDetailFailed?: string
  /* ───────── AppType 欢迎面板 ───────── */
  /** 欢迎页大标题 */
  welcomeTitle?: string
  /** 欢迎页副标题描述 */
  welcomeDescription?: string
  /* ───────── CollapsibleMessageGroup 折叠组 ───────── */
  /** 任务终止文案 */
  taskTerminated?: string
  /** 网络搜索中（streaming） */
  collapseSearching?: string
  /** 已搜索网页（done） */
  collapseSearched?: string
  /** 思考中 */
  collapseThinking?: string
  /** 深度思考（thought 折叠项标签） */
  collapseDeepThinking?: string
  /** 调用工具中（streaming） */
  collapseCallingTools?: string
  /** 调用了 N 次工具，支持 {count} 占位符 */
  collapseCalledTools?: string
  /** 读写文件中（streaming） */
  collapseReadingFiles?: string
  /** 读取了 N 个文件，支持 {count} 占位符 */
  collapseReadFiles?: string
  /** 修改文件中（streaming） */
  collapseWritingFiles?: string
  /** 修改了 N 个文件，支持 {count} 占位符 */
  collapseWroteFiles?: string
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
  openSource?: string
  referenceSlice?: string
  /** widget action 用户消息显示文本 */
  actionPerformed?: string
  /** AI 生成免责提示 */
  aiDisclaimer?: string
}

/** Sender 国际化文本 */
export interface SenderI18n {
  placeholder?: string
  placeholderMobile?: string
  uploadImg?: string
  /** 上传菜单"图片"选项 */
  uploadImage?: string
  /** 上传菜单"文件"选项 */
  uploadFile?: string
  /** 文件数量超出限制提示（{count} 为数量占位符） */
  fileLimitExceeded?: string
  /** 文件大小超出限制提示（{size} 为大小占位符） */
  fileSizeExceeded?: string
  /** 文件上传/解析中提示 */
  uploadingWait?: string
  startRecord?: string
  stopRecord?: string
  answering?: string
  notSupport?: string
  uploadError?: string
  recordTooLong?: string
  asrServiceFailed?: string
  recordFailed?: string
  chromeSecurityError?: string
  browserNotSupport?: string
  audioContextNotSupport?: string
  webAudioApiNotSupport?: string
  mediaStreamSourceNotSupport?: string
}

/** 文件预览面板国际化文本 */
export interface FilePreviewI18n {
  /** 文档列表标题 */
  docList?: string
  /** 刷新按钮 title */
  refresh?: string
  /** 加载中文本 */
  loading?: string
  /** 加载文档预览中 */
  loadingPreview?: string
  /** 预览加载失败 */
  previewFailed?: string
  /** 重试按钮 */
  retry?: string
  /** 打开文件列表按钮 tooltip */
  openFileList?: string
  /** 显示文档列表按钮 title */
  showDocList?: string
  /** 隐藏文档列表按钮 title */
  hideDocList?: string
  /** 不支持预览的文件格式提示 */
  unsupported?: string
  /** 下载按钮 title */
  download?: string
  /** 开始下载提示（{name} 为文件名占位符） */
  downloadStarted?: string
}

/** 侧边栏布局 Props */
export interface SidePanelProps {
  /** 侧边栏是否使用overlay模式（覆盖内容区域） */
  isSidePanelOverlay?: boolean
}

/** 通用布局 Props - 组合多个常用 props */
export interface CommonLayoutProps extends ThemeProps, MobileProps, SidePanelProps {}

/** 聊天相关 Props - 组合聊天组件常用 props */
export interface ChatRelatedProps extends CommonLayoutProps {
  /** 当前语言标识，用于自动选择内部默认 i18n（如 'zh-CN'、'en-US'） */
  language?: string
  /** 聊天模式：claw-简化模式，standard-标准模式 */
  mode?: ChatMode
}

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
  language: 'zh-CN',
  mode: 'standard' as ChatMode,
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
  uploading: '文件上传中',
  loading: '加载中',
  thinking: '思考中',
  checkAll: '全选',
  shareFor: '分享至',
  copyUrl: '链接',
  cancelShare: '取消分享',
  sendError: '发送失败',
  networkError: '网络错误',
  loginExpired: '登录过期，请重新登录',
  createConversation: '新建对话',
  copySuccess: '复制成功',
  copyFailed: '复制失败',
  copy: '复制',
  view: '查看',
  shareFailed: '分享失败',
  loadMoreFailed: '加载更多失败',
  rateFailed: '评分失败',
  getAppListFailed: '获取应用列表失败',
  getConversationListFailed: '获取会话列表失败',
  getConversationDetailFailed: '获取会话详情失败',

  /* AppType 欢迎面板 */
  welcomeTitle: '描述需求，开启智能工作方式',
  welcomeDescription: '一站式智能工作台，连接企业知识库与技能工具，替你从规划到执行完成每一项任务。',

  /* CollapsibleMessageGroup 折叠组 */
  taskTerminated: '任务终止',
  collapseSearching: '网络搜索中',
  collapseSearched: '搜索了网页',
  collapseThinking: '思考中',
  collapseDeepThinking: '深度思考',
  collapseCallingTools: '调用工具中',
  collapseCalledTools: '调用了{count}次工具',
  collapseReadingFiles: '读写文件中',
  collapseReadFiles: '读取了{count}个文件',
  collapseWritingFiles: '修改文件中',
  collapseWroteFiles: '修改了{count}个文件',
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
  openSource: '打开原文',
  referenceSlice: '引用切片',
  actionPerformed: '已进行操作',
  aiDisclaimer: '该回答由AI助手生成，请谨慎识别',
}

/** Sender i18n 默认值 */
export const defaultSenderI18n: Required<SenderI18n> = {
  placeholder: '请输入消息...',
  placeholderMobile: '请输入',
  uploadImg: '上传图片或文件',
  uploadImage: '图片',
  uploadFile: '文件',
  fileLimitExceeded: '最多上传 {count} 个文件',
  fileSizeExceeded: '文件大小不能超过 {size}',
  uploadingWait: '文件上传/解析中，请稍候',
  startRecord: '点击开始录音',
  stopRecord: '点击停止录音',
  answering: '回答中...',
  notSupport: '当前浏览器不支持录音',
  uploadError: '上传失败',
  recordTooLong: '录音时长超过限制',
  asrServiceFailed: '获取语音识别服务失败',
  recordFailed: '录音失败',
  chromeSecurityError: 'Chrome下获取录音功能需要在localhost、127.0.0.1或https下才能获取权限',
  browserNotSupport: '无法获取浏览器录音功能，请升级浏览器或使用Chrome',
  audioContextNotSupport: '浏览器不支持AudioContext',
  webAudioApiNotSupport: '浏览器不支持webAudioApi相关接口',
  mediaStreamSourceNotSupport: '不支持MediaStreamSource',
}

/** 文件预览面板 i18n 默认值 */
export const defaultFilePreviewI18n: Required<FilePreviewI18n> = {
  docList: '文档列表',
  refresh: '刷新',
  loading: '正在加载...',
  loadingPreview: '正在加载文档预览...',
  previewFailed: '预览加载失败',
  retry: '重试',
  openFileList: '展开工作区',
  showDocList: '显示文档列表',
  hideDocList: '隐藏文档列表',
  unsupported: '暂不支持预览该文件格式',
  download: '下载',
  downloadStarted: '开始下载: {name}',
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
  uploading: 'Uploading',
  loading: 'Loading',
  thinking: 'Thinking',
  checkAll: 'Select All',
  shareFor: 'Share to',
  copyUrl: 'Link',
  cancelShare: 'Cancel Share',
  sendError: 'Send Failed',
  networkError: 'Network Error',
  loginExpired: 'Session expired, please log in again',
  createConversation: 'New Conversation',
  copySuccess: 'Copied',
  copyFailed: 'Copy Failed',
  copy: 'Copy',
  view: 'View',
  shareFailed: 'Share Failed',
  loadMoreFailed: 'Load More Failed',
  rateFailed: 'Rate Failed',
  getAppListFailed: 'Failed to get app list',
  getConversationListFailed: 'Failed to get conversation list',
  getConversationDetailFailed: 'Failed to get conversation detail',

  /* AppType welcome panel */
  welcomeTitle: 'Describe what you need to start working smarter',
  welcomeDescription: 'A one-stop intelligent workbench that connects enterprise knowledge and skill tools to handle every task end-to-end.',

  /* CollapsibleMessageGroup */
  taskTerminated: 'Task terminated',
  collapseSearching: 'Searching...',
  collapseSearched: 'Searched the web',
  collapseThinking: 'Thinking...',
  collapseDeepThinking: 'Deep thinking',
  collapseCallingTools: 'Calling tools...',
  collapseCalledTools: 'Called tools {count} time(s)',
  collapseReadingFiles: 'Reading files...',
  collapseReadFiles: 'Read {count} file(s)',
  collapseWritingFiles: 'Writing files...',
  collapseWroteFiles: 'Modified {count} file(s)',
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
  openSource: 'Open Source',
  referenceSlice: 'Reference Slice',
  actionPerformed: 'Action performed',
  aiDisclaimer: 'This answer is generated by AI assistant, please verify carefully',
}

/** Sender i18n 英文默认值 */
export const defaultSenderI18nEn: Required<SenderI18n> = {
  placeholder: 'Type a message...',
  placeholderMobile: 'Type here',
  uploadImg: 'Upload Image or File',
  uploadImage: 'Image',
  uploadFile: 'File',
  fileLimitExceeded: 'Upload up to {count} files',
  fileSizeExceeded: 'File size cannot exceed {size}',
  uploadingWait: 'Uploading/parsing files, please wait',
  startRecord: 'Start Recording',
  stopRecord: 'Stop Recording',
  answering: 'Answering...',
  notSupport: 'Recording not supported',
  uploadError: 'Upload Failed',
  recordTooLong: 'Recording too long',
  asrServiceFailed: 'Failed to get ASR service',
  recordFailed: 'Recording failed',
  chromeSecurityError: 'Chrome requires localhost, 127.0.0.1 or HTTPS to access recording',
  browserNotSupport: 'Browser does not support recording, please upgrade or use Chrome',
  audioContextNotSupport: 'Browser does not support AudioContext',
  webAudioApiNotSupport: 'Browser does not support Web Audio API',
  mediaStreamSourceNotSupport: 'MediaStreamSource is not supported',
}

/** 文件预览面板 i18n 英文默认值 */
export const defaultFilePreviewI18nEn: Required<FilePreviewI18n> = {
  docList: 'Documents',
  refresh: 'Refresh',
  loading: 'Loading...',
  loadingPreview: 'Loading document preview...',
  previewFailed: 'Preview failed to load',
  retry: 'Retry',
  openFileList: 'Open file list',
  showDocList: 'Show document list',
  hideDocList: 'Hide document list',
  unsupported: 'This file format is not supported for preview',
  download: 'Download',
  downloadStarted: 'Downloading: {name}',
}

/** 根据语言获取 i18n 默认值 */
export const getI18nByLanguage = (language: string) => {
  const isEnglish = language.startsWith('en')
  return {
    sideI18n: isEnglish ? defaultSideI18nEn : defaultSideI18n,
    chatI18n: isEnglish ? defaultChatI18nEn : defaultChatI18n,
    chatItemI18n: isEnglish ? defaultChatItemI18nEn : defaultChatItemI18n,
    senderI18n: isEnglish ? defaultSenderI18nEn : defaultSenderI18n,
    filePreviewI18n: isEnglish ? defaultFilePreviewI18nEn : defaultFilePreviewI18n,
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
  /** 文件预览面板国际化文本 */
  filePreviewI18n?: FilePreviewI18n
  /** API 配置 - 如果传入则使用 HTTP 请求获取数据 */
  apiConfig?: ApiConfig
  /** 是否自动加载数据（仅在使用 apiConfig 时生效） */
  autoLoad?: boolean
  /** 是否启用 Skills 功能 */
  enableSkills?: boolean
  /** Skills 空间 ID */
  skillsSpaceId?: string
  /** Skills 应用 ID（/adp/ 转发需要） */
  skillsApplicationId?: string
}
