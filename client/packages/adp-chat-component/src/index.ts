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
// 导入主题样式（TDesign 主题 CSS 变量）
import './styles/theme.css'

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
export { default as AssistQuickButtons } from './components/Chat/AssistQuickButtons.vue'
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

// Skills 组件导出
export { SkillsPopover } from './components/Skills';
export { SkillsInstallDialog } from './components/Skills';
export { SkillManageDialog } from './components/Skills';

// 类型导出
export type {
    ChatConfig,
    ChatMode,
    ThemeType,
    ThemeProps,
    MobileProps,
    SidePanelProps,
    OverlayProps,
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
    sidePanelPropsDefaults,
    overlayPropsDefaults,
    commonLayoutPropsDefaults,
    chatRelatedPropsDefaults,
    defaultLanguageOptions,
    defaultSideI18n,
    defaultChatI18n,
    defaultChatItemI18n,
    defaultSenderI18n,
    defaultSideI18nEn,
    defaultChatI18nEn,
    defaultChatItemI18nEn,
    defaultSenderI18nEn,
    getI18nByLanguage,
} from './model/type'
export type { Application, AppPattern, InputBoxButton, InputBoxConfig } from './model/application'
export type {
    ChatConversation,
    ChatConversationProps,
    Record,
    QuoteInfo,
    Reference,
} from './model/chat-v2'
export { ScoreValue } from './model/chat-v2'
export type { FileProps } from './model/file'

// Skills 类型导出
export type {
    AgentSkillInfo,
    SkillSummary,
    SkillCategory,
    NormalizedSkill,
    ManageSkillItem,
    SkillSelectEvent,
    SkillsI18n,
} from './model/skills'
export {
    AgentSkillType,
    defaultSkillsI18n,
    defaultSkillsI18nEn,
} from './model/skills'

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
    fetchReferenceDetails,
    sendMessage,
    rateMessage,
    createShare,
    fetchUserInfo,
    uploadFile,
    parseFile,
    getFileDownloadUrl,
    describeConversation,
    listDir,
    fetchFile,
    fetchModelList,
    describeAgentSummaryList,
    copyAgentFromApp,
    getAgentConfig,
    saveAgentConfig,
    createConversation,
    fetchSuggestionList,
} from './service'
export type {
    ApiConfig,
    ApiDetailConfig,
    SuggestionItem,
    SuggestionGroup,
    SuggestionListResponse,
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

// Skills API 服务导出
export {
    defaultSkillsApiConfig,
    fetchGlobalAgent,
    fetchSkillCategories,
    fetchSkillSummaryList,
} from './service/skillsApi'
export type { SkillsApiConfig } from './service/skillsApi'

// Composables 导出
export { useApiConfig } from './composables'
export { useSkills, normalizeSkill, normalizeManageItem } from './composables/useSkills'
export type { UseSkillsOptions } from './composables/useSkills'
export type { UseApiConfigOptions, UseApiConfigReturn } from './composables'

// 默认导出 (用于全局挂载)
export { default } from './main'
