/**
 * 组件挂载器模块
 * 用于在非 Vue 项目中动态挂载组件
 */

import { createApp, type App, type Component } from 'vue'
import { configureAxios } from './service/httpService'
import type { ApiConfig } from './service/api'

// 导入组件
import AIWarning from './components/AIWarning.vue'
import ApplicationList from './components/ApplicationList.vue'
import CreateConversation from './components/CreateConversation.vue'
import CustomizedIcon from './components/CustomizedIcon.vue'
import HistoryList from './components/HistoryList.vue'
import LogoArea from './components/LogoArea.vue'
import PersonalAccount from './components/PersonalAccount.vue'
import Search from './components/Search.vue'
import Settings from './components/Settings.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import Chat from './components/Chat/Index.vue'
import ChatItem from './components/Chat/ChatItem.vue'
import ChatSender from './components/Chat/Sender.vue'
import ChatAppType from './components/Chat/AppType.vue'
import OptionCard from './components/Common/OptionCard.vue'
import RecordIcon from './components/Common/RecordIcon.vue'
import ADPChat from './components/layout/Index.vue'
import MainLayout from './components/layout/MainLayout.vue'
import SideLayout from './components/layout/SideLayout.vue'
import ShareChat from './components/ShareChat.vue'



/**
 * 组件挂载配置接口
 */
export interface MountConfig {
  container: string
  [key: string]: any
}

/**
 * 组件挂载器接口
 */
export interface ComponentMounter<T extends MountConfig = MountConfig> {
  create: (config: T) => string | undefined
  mount: (container: string, config?: Omit<T, 'container'>) => string | undefined
  unmount: (id: string) => void
}

// 存储已挂载的应用实例
const mountedApps: Map<string, App> = new Map()

/**
 * 创建容器元素并添加到指定容器中
 */
export function createContainerElement(parentContainer: string, id: string): HTMLElement | null {
  const containerElement = document.querySelector(parentContainer)
  
  if (!containerElement) {
    console.error(`Container ${parentContainer} not found`)
    return null
  }

  const div = document.createElement('div')
  div.id = id
  // 确保创建的容器继承父容器的宽高
  div.style.width = '100%'
  div.style.height = '100%'
  containerElement.appendChild(div)
  
  return div
}

/**
 * 卸载组件
 */
export function unmountComponent(id: string): void {
  const app = mountedApps.get(id)
  if (app) {
    app.unmount()
    mountedApps.delete(id)
    const element = document.getElementById(id)
    if (element) {
      element.remove()
    }
  }
}

/**
 * 获取已挂载的应用实例 Map
 */
export function getMountedApps(): Map<string, App> {
  return mountedApps
}

/**
 * 创建通用组件挂载器
 */
function createComponentMounter<T extends MountConfig>(
  component: Component,
  prefix: string
): ComponentMounter<T> {
  const create = (config: T): string | undefined => {
    const { container, ...props } = config
    const id = `${prefix}-${Date.now()}`
    
    const div = createContainerElement(container, id)
    if (!div) return undefined

    // 如果配置中包含 apiConfig，则配置 axios（apiConfig 现在直接是 AxiosRequestConfig）
    const apiConfig = (props as any).apiConfig as ApiConfig | undefined
    if (apiConfig) {
      configureAxios(apiConfig)
    }

    const app = createApp(component, props)
    app.mount(`#${id}`)
    mountedApps.set(id, app)
    
    return id
  }

  const mount = (container: string, config?: Omit<T, 'container'>): string | undefined => {
    return create({ container, ...config } as T)
  }

  const unmount = (id: string): void => {
    unmountComponent(id)
  }

  return { create, mount, unmount }
}

// ==================== 组件配置类型 ====================

export interface AIWarningConfig extends MountConfig {
  text?: string
}

export interface ApplicationListConfig extends MountConfig {
  applications?: any[]
  currentApplication?: any
  maxLen?: number
  theme?: 'light' | 'dark'
  i18n?: { more?: string; collapse?: string }
  onSelect?: (app: any) => void
}

export interface CreateConversationConfig extends MountConfig {
  text?: string
  onClick?: () => void
}

export interface CustomizedIconConfig extends MountConfig {
  name: string
  theme?: 'light' | 'dark'
  size?: string
}

export interface HistoryListConfig extends MountConfig {
  conversations?: any[]
  currentConversation?: any
  theme?: 'light' | 'dark'
  i18n?: { today?: string; recent?: string }
  onSelect?: (conversation: any) => void
}

export interface LogoAreaConfig extends MountConfig {
  logoUrl?: string
  title?: string
}

export interface PersonalAccountConfig extends MountConfig {
  avatarUrl?: string
  avatarName?: string
  name?: string
}

export interface SearchConfig extends MountConfig {
  placeholder?: string
  onSearch?: (value: string) => void
}

export interface SettingsConfig extends MountConfig {
  theme?: 'light' | 'dark'
  languageOptions?: any[]
  i18n?: { switchTheme?: string; selectLanguage?: string; logout?: string }
  onToggleTheme?: () => void
  onChangeLanguage?: (key: string) => void
  onLogout?: () => void
}

export interface SidebarToggleConfig extends MountConfig {
  collapsed?: boolean
  onToggle?: () => void
}

export interface ChatComponentConfig extends MountConfig {
  chatId?: string
  chatList?: any[]
  isChatting?: boolean
  currentApplicationId?: string
  currentApplicationAvatar?: string
  currentApplicationName?: string
  currentApplicationGreeting?: string
  currentApplicationOpeningQuestions?: string[]
  isMobile?: boolean
  theme?: 'light' | 'dark'
  i18n?: any
  chatItemI18n?: any
  senderI18n?: any
  onSend?: (query: string, fileList: any[], conversationId: string, applicationId: string) => void
  onStop?: () => void
  onLoadMore?: (conversationId: string, lastRecordId: string) => void
  onRate?: (conversationId: string, recordId: string, score: any) => void
  onShare?: (conversationId: string, applicationId: string, recordIds: string[]) => void
  onCopy?: (rowtext: string | undefined, content: string | undefined, type: string) => void
  onUploadFile?: (files: File[]) => void
  onStartRecord?: () => void
  onStopRecord?: () => void
  onMessage?: (type: string, message: string) => void
  onConversationChange?: (conversationId: string) => void
}

export interface ChatItemConfig extends MountConfig {
  item: any
  index: number
  isLastMsg?: boolean
  loading?: boolean
  isStreamLoad?: boolean
  isMobile?: boolean
  theme?: 'light' | 'dark'
  showActions?: boolean
  i18n?: any
}

export interface ChatSenderConfig extends MountConfig {
  isStreamLoad?: boolean
  isMobile?: boolean
  theme?: 'light' | 'dark'
  i18n?: any
  onSend?: (value: string, fileList: any[]) => void
  onStop?: () => void
  onUploadFile?: (files: File[]) => void
  onStartRecord?: () => void
  onStopRecord?: () => void
  onMessage?: (type: string, message: string) => void
}

export interface ChatAppTypeConfig extends MountConfig {
  currentApplicationAvatar?: string
  currentApplicationName?: string
  currentApplicationGreeting?: string
  currentApplicationOpeningQuestions?: string[]
  isMobile?: boolean
  onSelectQuestion?: (question: string) => void
}

export interface OptionCardConfig extends MountConfig {
  title?: string
  description?: string
  onClick?: () => void
}

export interface RecordIconConfig extends MountConfig {
  recording?: boolean
}

export interface ADPChatConfig extends MountConfig {
  applications?: any[]
  currentApplication?: any
  conversations?: any[]
  currentConversation?: any
  chatList?: any[]
  isChatting?: boolean
  user?: any
  theme?: 'light' | 'dark'
  languageOptions?: any[]
  isMobile?: boolean
  logoUrl?: string
  logoTitle?: string
  maxAppLen?: number
  isShowCloseButton?: boolean
  isShowFullscreenButton?: boolean
  isFullscreen?: boolean
  aiWarningText?: string
  sideI18n?: any
  chatI18n?: any
  chatItemI18n?: any
  senderI18n?: any
  apiConfig?: ApiConfig
  autoLoad?: boolean
  onFullscreen?: (isFullscreen: boolean) => void
}

export interface MainLayoutConfig extends MountConfig {
  theme?: 'light' | 'dark'
  isMobile?: boolean
}

export interface SideLayoutConfig extends MountConfig {
  theme?: 'light' | 'dark'
  collapsed?: boolean
}

export interface ShareChatConfig extends MountConfig {
  shareId: string
  theme?: 'light' | 'dark'
  apiPath?: string
  onLoadComplete?: (records: any[]) => void
  onLoadError?: (error: Error) => void
}

// ==================== 组件挂载器 ====================

export const AIWarningMounter = createComponentMounter<AIWarningConfig>(AIWarning, 'adp-ai-warning')
export const ApplicationListMounter = createComponentMounter<ApplicationListConfig>(ApplicationList, 'adp-application-list')
export const CreateConversationMounter = createComponentMounter<CreateConversationConfig>(CreateConversation, 'adp-create-conversation')
export const CustomizedIconMounter = createComponentMounter<CustomizedIconConfig>(CustomizedIcon, 'adp-customized-icon')
export const HistoryListMounter = createComponentMounter<HistoryListConfig>(HistoryList, 'adp-history-list')
export const LogoAreaMounter = createComponentMounter<LogoAreaConfig>(LogoArea, 'adp-logo-area')
export const PersonalAccountMounter = createComponentMounter<PersonalAccountConfig>(PersonalAccount, 'adp-personal-account')
export const SearchMounter = createComponentMounter<SearchConfig>(Search, 'adp-search')
export const SettingsMounter = createComponentMounter<SettingsConfig>(Settings, 'adp-settings')
export const SidebarToggleMounter = createComponentMounter<SidebarToggleConfig>(SidebarToggle, 'adp-sidebar-toggle')
export const ChatMounter = createComponentMounter<ChatComponentConfig>(Chat, 'adp-chat')
export const ChatItemMounter = createComponentMounter<ChatItemConfig>(ChatItem, 'adp-chat-item')
export const ChatSenderMounter = createComponentMounter<ChatSenderConfig>(ChatSender, 'adp-chat-sender')
export const ChatAppTypeMounter = createComponentMounter<ChatAppTypeConfig>(ChatAppType, 'adp-chat-app-type')
export const OptionCardMounter = createComponentMounter<OptionCardConfig>(OptionCard, 'adp-option-card')
export const RecordIconMounter = createComponentMounter<RecordIconConfig>(RecordIcon, 'adp-record-icon')
export const ADPChatMounter = createComponentMounter<ADPChatConfig>(ADPChat, 'adp-chat-layout')
export const MainLayoutMounter = createComponentMounter<MainLayoutConfig>(MainLayout, 'adp-main-layout')
export const SideLayoutMounter = createComponentMounter<SideLayoutConfig>(SideLayout, 'adp-side-layout')
export const ShareChatMounter = createComponentMounter<ShareChatConfig>(ShareChat, 'adp-share-chat')
