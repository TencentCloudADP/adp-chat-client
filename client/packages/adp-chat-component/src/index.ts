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
export { default as FileList } from './components/Common/FileList.vue'
export { default as MdContent } from './components/Common/MdContent.vue'
export { default as OptionCard } from './components/Common/OptionCard.vue'
export { default as RecordIcon } from './components/Common/RecordIcon.vue'

// Layout 组件导出
export { default as ChatLayout } from './components/layout/Index.vue'
export { default as MainLayout } from './components/layout/MainLayout.vue'
export { default as SideLayout } from './components/layout/SideLayout.vue'

// 类型导出
export type { ChatConfig } from './model/type'
export type { Application } from './model/application'
export type { ChatConversation, Record, AgentThought } from './model/chat'
export type { FileProps } from './model/file'
export type { ApiConfig } from './service/api'

// Service 导出
export {
    httpService,
    configureAxios,
    setRequestInterceptor,
    setResponseInterceptor,
    defaultApiConfig,
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
} from './utils/device'

// 默认导出 (用于全局挂载)
export { default } from './main'
