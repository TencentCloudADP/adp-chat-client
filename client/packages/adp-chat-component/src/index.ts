/**
 * ADP Chat Component 组件库入口
 * 导出所有组件、类型、服务和工具函数
 */

// 导入 TDesign 基础样式（UMD 模式需要）
import 'tdesign-vue-next/es/style/index.css'
// 导入 TDesign Chat 样式
import '@tdesign-vue-next/chat/es/style/index.css'
// 导入全局样式（确保打包时包含）
import './style.css'

// 基础组件导出
export { default as AIWarning } from './components/AIWarning.vue'
export { default as ApplicationList } from './components/ApplicationList.vue'
export { default as CreateConversation } from './components/CreateConversation.vue'
export { default as CustomizedIcon } from './components/CustomizedIcon.vue'
export { default as HistoryList } from './components/HistoryList.vue'
export { default as LogoArea } from './components/LogoArea.vue'
export { default as PersonalAccount } from './components/PersonalAccount.vue'
export { default as Search } from './components/Search.vue'
export { default as Settings } from './components/Settings.vue'
export { default as SidebarToggle } from './components/SidebarToggle.vue'

// Chat 组件导出
export { default as Chat } from './components/Chat/Index.vue'
export { default as ChatItem } from './components/Chat/ChatItem.vue'
export { default as ChatSender } from './components/Chat/Sender.vue'
export { default as ChatAppType } from './components/Chat/AppType.vue'
// Common 组件导出
export { default as MdContent } from './components/Common/MdContent.vue'
export { default as OptionCard } from './components/Common/OptionCard.vue'
export { default as RecordIcon } from './components/Common/RecordIcon.vue'

// Layout 组件导出
export { default as ADPChat } from './components/layout/Index.vue'
export { default as MainLayout } from './components/layout/MainLayout.vue'
export { default as SideLayout } from './components/layout/SideLayout.vue'

// 功能组件导出
export { default as ShareChat } from './components/ShareChat.vue'

// 类型导出
export type {
    ChatConfig,
    ThemeType,
    ThemeProps,
    MobileProps,
    FullscreenProps,
    CommonLayoutProps,
    ChatRelatedProps,
    LanguageOption,
    UserInfo,
    SideI18n,
    ChatI18n,
    ChatItemI18n,
    SenderI18n,
} from './model/type'
export {
    themePropsDefaults,
    mobilePropsDefaults,
    fullscreenPropsDefaults,
    commonLayoutPropsDefaults,
    chatRelatedPropsDefaults,
    defaultLanguageOptions,
    defaultSideI18n,
    defaultChatI18n,
    defaultChatItemI18n,
    defaultSenderI18n,
} from './model/type'
export type { Application } from './model/application'
export type {
    ChatConversation,
    ChatConversationProps,
    Record,
    AgentThought,
    Debugging,
    Procedure,
    ExtraInfo,
    QuoteInfo,
    Reference,
    TokenStat,
    TokenStatProcedure,
    ChatItemData,
    WorkFlow,
} from './model/chat'
export { ScoreValue } from './model/chat'
export type { FileProps } from './model/file'
export type { ApiConfig, ApiDetailConfig } from './service/api'

// Service 导出
export {
    httpService,
    configureAxios,
    setRequestInterceptor,
    setResponseInterceptor,
    defaultApiDetailConfig,
    fetchApplicationList,
    fetchConversationList,
    fetchConversationDetail,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
} from './service'

// Utils 导出
export {
    computeIsMobile,
    detectMobileByScreen,
    detectMobileBySize,
    isMobileUA,
    hasTouch,
    isSmallScreen,
    isSmallContainer,
    parseSize,
    normalizeSize,
    normalizeWidth,
    normalizeHeight,
    getViewportWidth,
    getViewportHeight,
} from './utils/device'

// Composables 导出
export { useApiConfig } from './composables'
export type { UseApiConfigOptions, UseApiConfigReturn } from './composables'

// 默认导出 (用于全局挂载)
export { default } from './main'
