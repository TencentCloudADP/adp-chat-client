import { createApp, h, ref, defineComponent } from 'vue'
import './style.css'

import AppComponent from './App.vue'
import type { ChatConfig } from './model/type'
import { configureAxios } from './service/httpService'

// 导入挂载器模块
import {
  createContainerElement,
  unmountComponent,
  getMountedApps,
  // 组件挂载器
  AIWarningMounter,
  ApplicationListMounter,
  CreateConversationMounter,
  CustomizedIconMounter,
  HistoryListMounter,
  LogoAreaMounter,
  PersonalAccountMounter,
  SearchMounter,
  SettingsMounter,
  SidebarToggleMounter,
  ChatMounter,
  ChatItemMounter,
  ChatSenderMounter,
  ChatAppTypeMounter,
  OptionCardMounter,
  RecordIconMounter,
  ChatLayoutMounter,
  MainLayoutMounter,
  SideLayoutMounter,
  ShareChatMounter,
} from './mounters'

// 重新导出挂载器模块的所有内容
export * from './mounters'

// 存储已初始化的应用配置（用于 update）
const mountedConfigs: Map<string, { props: ReturnType<typeof ref<Record<string, any>>>, containerId: string }> = new Map()

/**
 * 初始化完整聊天应用
 */
function init(container?: string, config?: ChatConfig) {
  if (!container) {
    container = 'body'
  }
  const containerDiv = document.querySelector(container)
  const containerId = containerDiv?.id + '-app'
  
  const dummyDiv = createContainerElement(container, containerId)
  if (!dummyDiv) return

  // 如果传入 apiConfig，则配置 axios（apiConfig 现在直接是 AxiosRequestConfig）
  if (config?.apiConfig) {
    configureAxios(config.apiConfig)
  }

  // 使用 ref 存储 props，以便后续更新
  const propsRef = ref<Record<string, any>>({
    container: container,
    theme: 'light' as const,
    logoTitle: 'ADP Chat',
    isOverlay: false,
    ...config
  })

  // 创建一个包装组件，使用 defineComponent 确保响应式正确追踪
  const WrapperComponent = defineComponent({
    name: 'ADPChatWrapper',
    setup() {
      // 返回渲染函数，Vue 会自动追踪 propsRef.value 的变化
      return () => h(AppComponent, { ...propsRef.value })
    }
  })

  const app = createApp(WrapperComponent)
  const instance = app.mount('#' + dummyDiv.id)
  getMountedApps().set(containerId, app)
  
  // 存储配置用于后续 update
  mountedConfigs.set(container, { props: propsRef, containerId })
  
  return instance
}

/**
 * 更新已挂载应用的 props（不刷新组件）
 */
function update(container?: string, config?: Partial<ChatConfig>) {
  if (!container) {
    container = 'body'
  }
  
  const mountedConfig = mountedConfigs.get(container)
  if (!mountedConfig) {
    console.warn(`[ADPChatComponent] No mounted app found for container: ${container}. Please call init() first.`)
    return false
  }

  // 如果传入新的 apiConfig，更新 axios 配置
  if (config?.apiConfig) {
    configureAxios(config.apiConfig)
  }

  // 更新 ref 的 value（会自动触发组件响应式更新）
  if (config) {
    // 合并现有 props 和新 config，确保不丢失之前的配置
    mountedConfig.props.value = {
      ...mountedConfig.props.value,
      ...config
    }
  }

  return true
}

/**
 * 获取已挂载应用的当前 props
 */
function getProps(container?: string): Record<string, any> | undefined {
  if (!container) {
    container = 'body'
  }
  return mountedConfigs.get(container)?.props.value
}

// 导出给全局使用
const ADPChatComponent = {
  init,
  update,
  getProps,
  unmount: unmountComponent,
  AIWarning: AIWarningMounter,
  ApplicationList: ApplicationListMounter,
  CreateConversation: CreateConversationMounter,
  CustomizedIcon: CustomizedIconMounter,
  HistoryList: HistoryListMounter,
  LogoArea: LogoAreaMounter,
  PersonalAccount: PersonalAccountMounter,
  Search: SearchMounter,
  Settings: SettingsMounter,
  SidebarToggle: SidebarToggleMounter,
  Chat: ChatMounter,
  ChatItem: ChatItemMounter,
  ChatSender: ChatSenderMounter,
  ChatAppType: ChatAppTypeMounter,
  OptionCard: OptionCardMounter,
  RecordIcon: RecordIconMounter,
  ChatLayout: ChatLayoutMounter,
  MainLayout: MainLayoutMounter,
  SideLayout: SideLayoutMounter,
  ShareChat: ShareChatMounter,
}

// 挂载到全局对象
if (typeof window !== 'undefined') {
  (window as any).ADPChatComponent = ADPChatComponent
}

if (import.meta.env.DEV) {
  init('#chat-panel',{
    isOverlay: false
  })
}

export { init, update, getProps }
export default ADPChatComponent
