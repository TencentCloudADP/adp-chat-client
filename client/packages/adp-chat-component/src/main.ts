import { createApp } from 'vue'
import './style.css'

import AppComponent from './App.vue'
import type { ChatConfig } from './model/type'

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
  FileListMounter,
  OptionCardMounter,
  RecordIconMounter,
  ChatLayoutMounter,
  MainLayoutMounter,
  SideLayoutMounter,
} from './mounters'

// 重新导出挂载器模块的所有内容
export * from './mounters'

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

  const params = {
    container: container,
    canPark: container != 'body',
    theme: 'light' as const,
    logoTitle: 'ADP Chat',
    modelType: 'full' as const,
    ...config
  }

  const app = createApp(AppComponent, params)
  const instance = app.mount('#' + dummyDiv.id)
  getMountedApps().set(containerId, app)
  
  return instance
}

// 导出给全局使用
const ADPChatComponent = {
  init,
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
  FileList: FileListMounter,
  OptionCard: OptionCardMounter,
  RecordIcon: RecordIconMounter,
  ChatLayout: ChatLayoutMounter,
  MainLayout: MainLayoutMounter,
  SideLayout: SideLayoutMounter,
}

// 挂载到全局对象
if (typeof window !== 'undefined') {
  (window as any).ADPChatComponent = ADPChatComponent
}

if (import.meta.env.DEV) {
  init('#chat-panel',{
    modelType: 'full'
  })
}

export { init }
export default ADPChatComponent
